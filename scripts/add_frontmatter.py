#!/usr/bin/env python3
"""
add_frontmatter.py - 为 Markdown 文件添加 Hugo 格式的 YAML Front Matter
用法: python add_frontmatter.py <content_directory>
例如: python add_frontmatter.py /path/to/hugo/content
"""

import os
import sys
from datetime import datetime
from pathlib import Path

def generate_frontmatter(file_path, title):
    """生成 YAML Front Matter 字符串"""
    stat = os.stat(file_path)
    # 使用文件创建时间作为 date，最后修改时间作为 lastmod
    created = datetime.fromtimestamp(stat.st_ctime)
    modified = datetime.fromtimestamp(stat.st_mtime)
    
    fm = f"""---
title: "{title}"
date: {created.strftime('%Y-%m-%dT%H:%M:%S+08:00')}
lastmod: {modified.strftime('%Y-%m-%dT%H:%M:%S+08:00')}
draft: false
---
"""
    return fm

def has_frontmatter(content):
    """检查内容是否已经包含 YAML Front Matter（以 --- 开头）"""
    return content.strip().startswith('---')

def process_markdown_file(file_path):
    """处理单个 Markdown 文件，添加 Front Matter（如果没有）"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if has_frontmatter(content):
        print(f"跳过（已有 Front Matter）: {file_path}")
        return
    
    # 获取标题：去除扩展名
    title = file_path.stem
    fm = generate_frontmatter(file_path, title)
    
    new_content = fm + content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"已添加 Front Matter: {file_path}")

def main():
    if len(sys.argv) != 2:
        print("用法: python add_frontmatter.py <content_directory>")
        sys.exit(1)
    
    root_dir = Path(sys.argv[1])
    if not root_dir.exists():
        print(f"错误: 目录 {root_dir} 不存在")
        sys.exit(1)
    
    for md_file in root_dir.rglob("*.md"):
        process_markdown_file(md_file)

if __name__ == "__main__":
    main()