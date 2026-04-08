#/usr/bin/sh

python -m obsidian_to_hugo --hugo-content-dir ~/Documents/qytlix.github.io/content --obsidian-vault-dir ~/Documents/Obsidian/Fiction

python -m obsidian_to_hugo --hugo-content-dir ~/Documents/qytlix.github.io/content/tech --obsidian-vault-dir ~/Documents/Obsidian/Diary

python add_frontmatter.py content

python add_categories_tags.py content

python move_images.py ~/Documents/Obsidian/Fiction ~/Documents/qytlix.github.io/content --image-prefix /x/images
