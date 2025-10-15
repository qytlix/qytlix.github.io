#!/usr/bin/sh

gen_file_index() {
    cd "$1"

    # 获取当前目录的基本名称
    local dir_name=$(basename "$1")
    local index_name="${dir_name}_index.md"

    # 创建索引文件
    echo "# $dir_name index" > "$index_name"
    

    # upper index section - 包含上一级目录的索引文件
    local upper_index_name=$(find .. -maxdepth 1 -type f -name "*index.md")
    if [ ! -z "$upper_index_name" ]; then
        echo "" >> "$index_name"
        echo "- [back](./$upper_index_name)" >> "$index_name"
    fi

    # sub index section - 包含所有深度为1的子文件夹里的index文件
    # 查找深度为1的子文件夹（排除隐藏文件夹和当前目录）
    local sub_dirs=$(find . -maxdepth 1 -type d ! -name "*.*" ! -name ".")
    if [ ! -z "$sub_dirs" ]; then
        echo "" >> "$index_name"
        echo "## sub index" >> "$index_name"
        echo "" >> "$index_name"
        
        for sub_dir in $sub_dirs
        do
            # 获取子文件夹名称
            local sub_dir_name=$(basename "$sub_dir")
            local sub_index_name="${sub_dir_name}_index.md"
            
            gen_file_index "$sub_dir"
            echo "- [$sub_dir_name]($sub_dir/$sub_index_name)" >> "$index_name"
        done
    fi
    
    # file index section - 包含本文件夹下深度为1的所有文件
    # 查找深度为1的文件（排除索引文件本身）
    local files=$(find . -maxdepth 1 -type f ! -name "$index_name")
    if [ ! -z "$files" ]; then
        echo "" >> "$index_name"
        echo "## file index" >> "$index_name"
        echo "" >> "$index_name"

        for file in $files
        do
            local file_name=$(basename "$file")
            echo "- [$file_name]($file)" >> "$index_name"
        done
    fi
    
    cd ..
}

clean_index() {
    local indexs=$(find . -type f -name "*_index.md")
    for index in $indexs
    do
        echo "Clean index: $index"
        rm "$index"
    done
}

IFS=$'\n'
clean_index
dirs=$(find . -maxdepth 1 -type d ! -name "*.*" ! -name ".")
for dir in $dirs
do
    echo "Gen index: $dir"
    gen_file_index "$dir"
done