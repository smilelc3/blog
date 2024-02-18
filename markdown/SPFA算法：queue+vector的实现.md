---
title: SPFA算法：queue+vector的实现
date: 2017-05-25
tags: 
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/SPFA算法：queue+vector的实现/timg-2.jpg)

**SPFA**（Shortest Path Faster Algorithm）（队列优化）算法是求单源最短路径的一种算法，它还有一个重要的功能是判负环（在差分约束系统中会得以体现），在*Bellman-ford*算法的基础上加上一个队列优化，减少了冗余的松弛操作，是一种高效的最短路算法。

spfa的算法思想 —— `动态逼近法`：

​设立一个先进先出的队列q用来保存待优化的结点，优化时每次取出队首结点u，并且用u点当前的最短路径估计值对离开u点所指向的结点v进行松弛操作，如果v点的最短路径估计值有所调整，且v点不在当前的队列中，就将v点放入队尾。这样不断从队列中取出结点来进行松弛操作，直至队列空为止。

​松弛操作的原理是著名的定理：“**三角形两边之和大于第三边**”，在信息学中我们叫它**三角不等式**。所谓对结点i,j进行松弛，就是判定是否dis[j]>dis[i]+w[i,j]，如果该式成立则将dis[j]减小到dis[i]+w[i,j]，否则不动。

代码采用c++中STL模板(**queue + vector**), 减少不必的空间开销以及提高代码易读性

```c++
#include <iostream>
#include <queue>
#include <vector>
#include <array>

const int N = 20000 + 10;

std::queue<int> q;
auto next = std::vector<std::vector<int>>(N);
auto val = std::vector<std::vector<int>>(N);
std::array<bool, N> vis;
std::array<long long, N> dis;
int n, m, start = 1;

void input();

void init();

void spfa() {
    while (!q.empty()) {
        int tem = q.front();
        q.pop();
        for (int i = 0; i < next[tem].size(); i++) {
            if (dis[next[tem][i]] > dis[tem] + val[tem][i]) {
                dis[next[tem][i]] = dis[tem] + val[tem][i];
                if (!vis[next[tem][i]]) {
                    vis[next[tem][i]] = true;
                    q.push(next[tem][i]);
                }
            }
        }
    }
    for (int i = 1; i <= n; i++)
        std::cout << dis[i] << std::endl;
}

int main() {
    input();
    init();
    spfa();
    return 0;
}

void input() {
    std::cin >> n >> m;     // n 个点， m条边
    for (int i = 1; i <= m; i++) {
        int a, b, t;        // a -> b 存在一条距离为 t 的边
        std::cin >> a >> b >> t;
        next[a].push_back(b);
        val[a].push_back(t);
    }
}

void init() {
    vis.fill(false);
    dis.fill(0x3f3f3f3f);
    dis[start] = 0;
    q.push(start);
    vis[start] = true;
}
```
