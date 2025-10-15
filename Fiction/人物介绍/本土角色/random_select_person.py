#
## 随机选择一个人物来画
#

import os
import random

names = []
for root, dirs, files in os.walk(".", topdown=True):
    for name in files:
        if root == './编号/图片' :
            continue
        if root == './__pycache__':
            continue
        if name == 'random_select_person.py':
            continue
        names.append(os.path.splitext(name)[0])

ch = random.choice(names)
print(ch)
