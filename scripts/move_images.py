#!/usr/bin/env python3
"""
move_images.py - 移动 Obsidian Vault 中的图片到 Hugo static 目录并更新链接
支持 ![[wiki]] 和 ![alt](<path>) 或 ![alt](path) 格式
用法: python move_images.py <obsidian_vault_dir> <hugo_content_dir> [--static-dir <dir>] [--image-prefix <prefix>]
  --image-prefix: 图片在网页中的 URL 前缀，默认为 /images
                   例如：--image-prefix /x/images 则生成 /x/images/foo.png
                   如果不需要前导斜杠，可设为 images
"""

import os
import sys
import re
import shutil
import argparse
from pathlib import Path

def find_image_files(content, vault_dir, static_dir, md_file_path, image_prefix):
    """
    在 Markdown 内容中查找图片引用，复制图片到 static_dir，并返回替换后的内容
    image_prefix: 图片 URL 前缀，例如 "/images" 或 "/x/images"
    """
    copied_images = set()
    
    # 模式1: Obsidian Wiki 图片 ![[filename]]
    wiki_pattern = r'!\[\[([^\[\]]+\.(?:png|jpg|jpeg|gif|svg|webp))\]\]'
    
    def replace_wiki(match):
        img_file = match.group(1).strip()
        source_path = Path(vault_dir) / img_file
        if not source_path.exists():
            candidates = list(Path(vault_dir).rglob(img_file))
            if candidates:
                source_path = candidates[0]
            else:
                print(f"警告: 图片不存在 {img_file} (文件 {md_file_path})")
                return match.group(0)
        
        rel_img_path = source_path.relative_to(vault_dir)
        dest_path = static_dir / rel_img_path
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        
        if source_path not in copied_images:
            shutil.copy2(source_path, dest_path)
            copied_images.add(source_path)
            print(f"已复制图片: {source_path} -> {dest_path}")
        
        # 构造 URL：image_prefix + "/" + rel_img_path
        # 确保 image_prefix 不重复添加斜杠
        prefix = image_prefix.rstrip('/')
        url = f"{prefix}/{rel_img_path.as_posix()}" if prefix else rel_img_path.as_posix()
        return f"![{img_file}]({url})"
    
    new_content = re.sub(wiki_pattern, replace_wiki, content)
    
    # 模式2: 标准 Markdown 图片，支持可选的尖括号包裹路径
    md_pattern = r'!\[([^\]]*)\]\(\s*<?([^>)]+?)>?\s*\)'
    
    def replace_md(match):
        alt = match.group(1)
        raw_path = match.group(2).strip()
        
        if raw_path.startswith(('http://', 'https://', '//')):
            return match.group(0)
        
        md_dir = md_file_path.parent
        candidate = (md_dir / raw_path).resolve()
        if candidate.exists() and candidate.is_file():
            source_path = candidate
        else:
            candidate2 = (Path(vault_dir) / raw_path).resolve()
            if candidate2.exists() and candidate2.is_file():
                source_path = candidate2
            else:
                filename = Path(raw_path).name
                matches = list(Path(vault_dir).rglob(filename))
                if matches:
                    source_path = matches[0]
                    print(f"通过文件名匹配到图片: {raw_path} -> {source_path}")
                else:
                    print(f"警告: 图片不存在 {raw_path} (文件 {md_file_path})")
                    return match.group(0)
        
        try:
            rel_img_path = source_path.relative_to(vault_dir)
        except ValueError:
            rel_img_path = Path(source_path.name)
        
        dest_path = static_dir / rel_img_path
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        
        if source_path not in copied_images:
            shutil.copy2(source_path, dest_path)
            copied_images.add(source_path)
            print(f"已复制图片: {source_path} -> {dest_path}")
        
        prefix = image_prefix.rstrip('/')
        url = f"{prefix}/{rel_img_path.as_posix()}" if prefix else rel_img_path.as_posix()
        return f"![{alt}]({url})"
    
    new_content = re.sub(md_pattern, replace_md, new_content)
    return new_content, copied_images

def process_all_markdown_files(vault_dir, hugo_content_dir, static_dir, image_prefix):
    for md_file in Path(hugo_content_dir).rglob("*.md"):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, _ = find_image_files(content, vault_dir, static_dir, md_file, image_prefix)
        
        if new_content != content:
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"已更新图片链接: {md_file}")

def main():
    parser = argparse.ArgumentParser(description='将 Obsidian 中的图片复制到 Hugo 静态目录并更新链接')
    parser.add_argument('obsidian_vault', help='Obsidian Vault 根目录')
    parser.add_argument('hugo_content', help='Hugo content 目录（已转换的 Markdown 文件所在）')
    parser.add_argument('--static-dir', help='Hugo 静态图片目录（默认为 hugo_content/../static/images）')
    parser.add_argument('--image-prefix', default='/images', help='图片在网页中的 URL 前缀（默认 /images）')
    args = parser.parse_args()
    
    vault_dir = Path(args.obsidian_vault).resolve()
    if not vault_dir.exists():
        print(f"错误: Obsidian Vault 目录 {vault_dir} 不存在")
        sys.exit(1)
    
    content_dir = Path(args.hugo_content).resolve()
    if not content_dir.exists():
        print(f"错误: Hugo content 目录 {content_dir} 不存在")
        sys.exit(1)
    
    if args.static_dir:
        static_dir = Path(args.static_dir).resolve()
    else:
        static_dir = content_dir.parent / "static" / "images"
    static_dir.mkdir(parents=True, exist_ok=True)
    
    process_all_markdown_files(vault_dir, content_dir, static_dir, args.image_prefix)
    print("图片处理完成")

if __name__ == "__main__":
    main()