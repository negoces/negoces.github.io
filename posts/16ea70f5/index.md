# C++实现生成abbrlink


之前用过Hexo写过博客，用过一个插件叫hexo-abbrlink，可以生成文章唯一永久链接(8位16进制的字符串)，Hugo有个slug参数，可以用C++写个小程序生成一串字符并填入来模拟这个功能。

<!--more-->

> 这个实现方式只是通过生成8个0-15的随机数实现的，有概率会出现生成的字符重复的现象(只不过概率特别低)，不过其他方法我也不会啊，只能想到这种实现方式了(我太菜了)，就当作是练习C++的面向对象编程吧。

## 源代码

引入头文件

```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;
```

声明对象

```cpp
class Abbrlink
{
private:
    int abbr[8];

public:
    void New()
    {
        int seed = (int)time(0);
        for (int i = 0; i < 8; i++)
        {
            int bytes = -1;
            while ((bytes < 0) || (bytes > 15))
            {
                seed--;
                srand(seed);
                bytes = rand() % 16;
            }
            abbr[i] = bytes;
        }
    }

    void Print()
    {
        for (int i = 0; i < 8; i++)
        {
            cout << hex << abbr[i];
        }
        cout << endl;
    }
};
```

主函数

```cpp
int main()
{
    Abbrlink abbr;
    abbr.New();
    abbr.Print();
    return 0;
}
```


