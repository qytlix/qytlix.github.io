#!/usr/bin/env python3
"""
add_categories_tags.py - 为 Markdown 文件自动生成 categories 和 tags
用法: python add_categories_tags.py <content_directory> [--base-path <base>]
  --base-path: 可选，用于计算 categories 的根路径（默认为 content_directory 本身）
例如: python add_categories_tags.py /path/to/hugo/content --base-path /path/to/hugo
"""

import os
import sys
import re
import argparse
from pathlib import Path
import yaml

def extract_tags_from_content(content):
    """从 Markdown 内容中提取 #tag 格式的标签（支持中文）"""
    # 匹配 #后跟字母、数字、下划线、连字符、中文，但不匹配 URL 或代码块内的内容
    # 简单起见，此处匹配所有 #word，可自行改进
    pattern = r'(?<!\w)#([\w\u4e00-\u9fff\-]+)'
    tags = re.findall(pattern, content)
    # 去重并返回列表
    return list(set(tags))

def get_categories_from_path(file_path, base_path):
    """
    根据文件相对于 base_path 的目录结构生成 categories 列表
    例如: base_path=/hugo/content, file_path=/hugo/content/tech/programming/python.md
    返回: ['tech', 'programming']
    """
    rel_path = file_path.relative_to(base_path)
    # 获取父目录部分（不包括文件名）
    parent = rel_path.parent
    if str(parent) == '.':
        return []
    # 按路径分隔符拆分为列表
    categories = parent.parts
    return list(categories)

def update_frontmatter(file_path, base_path):
    """读取并更新 Front Matter，添加 categories 和 tags"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否有 Front Matter
    if not content.startswith('---'):
        print(f"警告: 文件无 Front Matter，跳过 {file_path}")
        return
    
    # 分离 Front Matter 和正文
    parts = content.split('---', 2)
    if len(parts) < 3:
        print(f"警告: Front Matter 格式错误，跳过 {file_path}")
        return
    
    frontmatter_str = parts[1].strip()
    body = parts[2]
    
    # 解析 YAML
    try:
        fm_data = yaml.safe_load(frontmatter_str) or {}
    except yaml.YAMLError as e:
        print(f"YAML 解析错误 {file_path}: {e}")
        return
    
    # 获取 categories（如果已存在则覆盖）
    categories = get_categories_from_path(file_path, base_path)
    categories.sort()  # 按顺序排放，以免每次更新的时候产生很多M
    if categories:
        fm_data['categories'] = categories
    
    # 获取 tags（合并已有的 tags 和从内容中提取的 tags）
    existing_tags = fm_data.get('tags', [])
    if isinstance(existing_tags, str):
        existing_tags = [existing_tags]
    content_tags = extract_tags_from_content(body)
    # 合并去重
    all_tags = list(set(existing_tags + content_tags))
    all_tags.sort()  # 按顺序排放，以免每次更新的时候产生很多M
    if all_tags:
        fm_data['tags'] = all_tags
    
    # 重新生成 Front Matter 字符串
    new_fm_str = yaml.dump(fm_data, allow_unicode=True, sort_keys=False)
    # 添加开头的 --- 和结尾的 ---（yaml.dump 不包含它们）
    new_content = f"---\n{new_fm_str}---\n{body}"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"已更新 categories/tags: {file_path}")

def main():
    parser = argparse.ArgumentParser(description='为 Hugo Markdown 文件添加 categories 和 tags')
    parser.add_argument('content_dir', help='Hugo content 目录路径')
    parser.add_argument('--base-path', help='用于计算 categories 的根目录（默认为 content_dir 的父目录）')
    args = parser.parse_args()
    
    content_dir = Path(args.content_dir)
    if not content_dir.exists():
        print(f"错误: 目录 {content_dir} 不存在")
        sys.exit(1)
    
    # 确定 base_path
    if args.base_path:
        base_path = Path(args.base_path)
    else:
        # 默认使用 content_dir 的父目录（即站点根目录）
        base_path = content_dir.parent
    
    for md_file in content_dir.rglob("*.md"):
        update_frontmatter(md_file, base_path)

if __name__ == "__main__":
    main()