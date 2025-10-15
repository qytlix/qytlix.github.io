#!/usr/bin/sh

echo "# blog index" > blog_index.md
echo "" >> blog_index.md

for blog_file in Blog/*.md
do
    echo "- [$blog_file]($blog_file)" >> blog_index.md
done