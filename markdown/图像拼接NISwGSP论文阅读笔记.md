---
title: 图像拼接NISwGSP论文阅读笔记
date: 2020-04-18
---

# Natural Image Stitching with the Global Similarity Prior

[论文原文](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/NISwGSP.pdf "NISwGSP.pdf")

**摘要：** 本文提出了一种将多个图像拼接在一起的方法，使得拼接图像看起来尽可能自然。我们的方法采用局部扭曲模型，用网格引导每个图像的变形。目标函数用于指定扭曲的所需特征。除了良好的对齐和最小的局部失真之外，我们还在目标函数中添加了全局先验相似性。该先验约束每个图像的扭曲，使其类似于整体的相似变换。选择相似性变换对拼接的自然性至关重要。我们提出了为每个图像选择合适的比例和旋转的方法。所有图像的扭曲被一起解决，以最小化全局失真。综合评估表明，所提出的方法始终优于多种最先进的方法，包括AutoStitch，APAP，SPHP和ANNAP。

**关键词：** 图像拼接，全景图，图像扭曲

<!-- more -->

## 1 介绍

图像拼接是将多个图像组合成具有更宽视场的更大图像的处理过程[^17]。早期的方法专注于提高无缝拼接的对齐精度，例如找到全局参数扭曲以使图像对齐。全球扭曲很强大，但往往不够灵活。为了解决全局扭曲模型的不足和提高对准质量，已经提出了几种局部扭曲模型，例如平滑变化的仿射（SVA）扭曲[^12]和尽可能投射（APAP）扭曲[^20]。这些方法采用多个局部参数扭曲以获得更好的对准精度。投影（仿射）正则化用于平滑地推断超出图像重叠的扭曲并且整体上类似于整体变换。拼接图像基本上是单视角的。因此，它们存在形状/区域变形的问题，并且缝合图像的部分可能被严重且不均匀地拉伸。当将多个图像拼接成非常宽的视角时，问题甚至更加严重。在这种情况下，失真累积并且远离基础图像的图像通常被显着拉伸。因此，拼接图像的视野通常具有限制。圆柱形和球形扭曲通过将图像投影到圆柱体或球体上来解决透视弯曲的相当窄视图的问题。不幸的是，这些扭曲通常会弯曲直线，并且只有在同一相机中心捕获的图像时才有效。

目前，有几种方法试图在保证图像对齐质量的同时，解决缝合图像中存在的畸变和视野受限的问题。由于具有宽视野的单视点图像不可避免地会引起严重的形状/尺寸失真，因此这些方法提供了多视点的拼接图像。Chang等人提出了形状保持半投影（SPHP）扭曲，它是投影变换和相似变换的空间组合[^4]。SPHP将重叠区域的投影变换平滑地推断为非重叠区域的相似性变换。投影变换在重叠区域中保持良好的对齐方式，而非重叠区域的相似性变换则可以保留图像的原始视角并减少了失真。除了投影变换之外，SPHP还可以与APAP结合使用，以实现更好的对准质量。但是，SPHP扭曲有几个问题（1）通过分析两个图像之间的单应性来形成SPHP变形。它继承了单应性的局限性，并存在视野受限的问题。因此，在拼接许多图像时通常会失败。（2）如果图像之间的空间关系为一维，则SPHP可以更好地处理变形。当空间关系为2D时，SPHP可能仍会失真（以图5为例）。（3）正如Lin等人所指出的[^11]，SPHP从单应性派生相似性转换。如果使用全局单应性，则派生的相似度变换可能会表现出不自然的旋转（例如图4(e)）。他们提出了一种自适应的“可能的自然变形”（AANAP）变形来解决旋转不自然的问题。AANAP扭曲将单应性线性化，然后将其缓慢更改为代表摄像机运动的估计全局相似度变换。AANAP仍然存在两个问题。首先，拼接多个图像时局部仍然存在失真（图4(f)，图5和图6）。其次，对全局相似性变换的估计并不可靠，并且仍然可能存在不自然的旋转和缩放（图1(b)，图3和图5）。

我们提出一种图像拼接方法，以解决这些问题并稳健地合成自然拼接图像。我们的方法采用局部变形模型。每个图像的变形均由网格划分。设计目标函数以指定所需的扭曲特性。将所有图像的扭曲一起求解，以获得最佳解决方案。优化导致线性系统稀疏，可以有效解决。关键思想是添加一个全局相似项，以要求每个图像的扭曲总体上都类似于相似变换。先前的方法已经表明，相似变换可以有效地减少失真[^4][^11]，但是它们通常是局部施加的。相反，我们为每张图像提出了全局相似度，其中恰当地选择比例和旋转度对于拼接图像的自然性至关重要。根据我们的观察，旋转度的选择对于拼接自然性至关重要。很少有人关注图像拼接的旋转选择问题。AutoStitch假定用户很少相对于地平线转动相机，并且可以通过计算向上矢量来使波浪全景图变直[^2]。AANAP使用特征匹配来确定最佳相似度转换[^11]。然而，这些试探法不够鲁棒。我们提出了健壮的方法来为每个图像选择合适的比例和旋转度。

我们的方法具有以下优点。首先，它没有有限视野的问题，这是APAP和SPHP共享的问题。其次，通过一起解决所有图像的扭曲，我们的方法可以最大限度地减少全局失真。最后，它为每个图像指定适当的比例和旋转，以使拼接图像看起来比以前的方法更自然。简而言之，我们的方法实现了以下目标：精确对准，减少形状失真，自然性并且不受视野限制。我们在42组图像上评估了所提出的方法，并且所提出的方法始终优于AutoStitch，APAP，SPHP和AANAP。图1展示了以前方法的常见问题。在图1(a)中，APAP + BA（束调整）[^21]通过将图像投影到圆柱体上克服了有限视场的问题。然而，它使用错误的比例和旋转，并且结果在图像上表现出非均匀的失真。AANAP不会正确选择旋转和缩放。在图1(b)中，误差累积并严重弯曲了拼接结果。我们的结果（图1(c)）看起来更自然，因为它可以正确选择比例和旋转。我们的方法也可以结合水平检测，结果可以进一步改进（图1（d））。

|         (a) APAP+BA          | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417134144351.png "图1(a)") |
| :--------------------------: | ------------------------------------------------------------ |
|          (b) AANAP           | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417134211548.png "图1(b)") |
|   (c) 我们的成果（3D方法）   | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417134250872.png "图1(c)") |
| (d) 带指定水平线的我们的成果 | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417134506426.png "图1(d)") |

图1 18个图像的拼接。

## 2 相关工作

Szeliski对图像拼接进行了全面的调研[^17]。图像拼接技术通常利用参数转换来全局或局部对齐图像。早期的方法使用全局参数扭曲，例如相似性，仿射和投影变换。有些人认为相机运动仅包含3D旋转。进行投影以将视球映射到图像平面以获得二维合成图像。一个著名的例子是Brown等人提出的AutoStitch方法[^1]。Gao等人提出了双重单应性变形，专门处理包含两个主导平面的场景[^5]。扭曲函数由具有空间变化权重的两个单应性矩阵的线性组合定义。由于它们的扭曲基于投影变换，因此生成的图像会受到投影失真（会拉伸和扩大区域）的影响。

局部扭曲模型采用多个局部参数扭曲以提高对齐精度。Lin等人通过使用平滑变化的仿射缝制场来优先处理用于图像缝制的局部扭曲模型[^12]。它们的翘曲是全局仿射的，同时允许局部变形。Zaragoza等人提出了在可能的情况下尽可能普遍地投影，同时允许局部偏差以更好地对齐[^20]。

几种方法没有关注对准质量，而是解决了拼接图像中的失真问题。Chang等人提出了保形的半投影扭曲，它是投影变换和相似变换的空间组合[^4]。投影变换在重叠区域中保持良好的对齐方式，而非重叠区域的相似性变换则保留了图像的原始视角并减少了失真。这种方法有时会导致不自然的旋转。Lin等人提出了一种自适应的自然可行（AANAP）弯曲来解决旋转不自然的问题[^11]。

已经提出了一些投影模型以减少由于投影引起的视觉失真。Zelnik-Manor等人用多平面投影代替圆柱投影[^22]。Kopf等人提出了局部适应的投影，该投影为整体圆柱形，而局部透视[^9]。Carroll等人提出了一种减少广角图像失真的内容保留投影[^3]。当不满足这些模型的基本假设时，就会发生失准，并且可以使用后处理方法（例如反虚像和混合）将其隐藏。

## 3 方法

我们的方法采用局部扭曲模型，包括以下步骤：

1. 特征检测和匹配

2. 图像匹配图的验证[^2]

3. APAP的匹配点生成[^20]
4. 焦距和3D旋转估计
5. 比例和旋转选择
6. 网格优化
7. 通过纹理映射合成结果

输入是一组N个图像，$I_1,I_2,...,I_N$。在不失一般性的情况下，我们使用$I_0$作为参考图像。我们首先通过SIFT[^13]检测每个图像中的特征及其匹配。步骤2确定图像间的邻接关系。在成对比对的质量方面，APAP表现最佳。因此，步骤3对相邻图像对应用APAP，并使用对齐结果来生成匹配点。细节将在3.1节中给出。我们的方法通过网格变形来缝合图像。3.2节描述了我们的能量函数设计。为了使拼接尽可能自然，我们添加了一个全局相似项，要求每个变形图像经历一个相似变换。为了确定每个图像的相似性变换，我们的方法估计每个图像的焦距和3D旋转（步骤4），然后选择最佳比例和旋转（步骤5）。第4节描述了这两个步骤的细节。最后，结果通过步骤6和7合成。

### 3.1 APAP生成匹配点

设$J$表示由步骤2检测到的一组相邻图像对。对于$J$中的一对相邻图像$I_i$和$I_j$，我们应用APAP使用来自步骤1的特征和匹配来对齐它们。请注意，APAP是一种基于网格的方法，每个图像都有一个用于对齐的网格。我们在$I_i$和$I_j$的重叠部分中收集$I_i$的网格顶点作为匹配点集合${\rm M}^{ij}$。对于${\rm M}^{ij}$中的每个匹配点，我们知道它在$I_j$中的对应关系，因为$I_i$和$I_{j}$已被APAP对齐。同样，我们为$I_{j}$设置了一组匹配点${\rm M}^{ji}$。

图2给出了匹配点的示例。给定图2（a）中的特征和匹配项，我们使用APAP对齐两个图像。对齐后，对于左图，我们有一组匹配点，它们只是APAP对齐后重叠区域中的网格点。对于这些匹配点，我们在右边的图像中有它们的对应关系。在进一步的步骤中，我们使用匹配点代替特征点，因为匹配点更均匀地分布。

| ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417134952668.png "图2(a)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417135000689.png "图2(b)") |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|                          (a) 特征点                          |                     (b) 匹配点（左对右）                     |

图2 特征点与匹配点。(a) 特征点及其匹配 (b)匹配点及其匹配

### 3.2 通过网格变形缝合

我们的拼接方法基于基于网格的图像变形。对于每个图像，我们使用网格来引导图像变形。设${\rm V}_i$和${\rm E}_i$表示图像$I_i$的网格中的顶点和边的集合。$\rm V$表示所有顶点的集合。我们的拼接算法试图找到一组变形的顶点位置$\tilde{\rm V}$，使得能量函数$\Psi(\rm V)$最小化。良好拼接的标准可能因应用领域而异。在我们的方法中，我们将多个图像拼接到一个全局平面上，并希望拼接图像看起来像原始图像一样自然。关于自然度的定义，我们假设原始图像对用户来说是自然的。因此，在局部上，我们的方法尽可能地保留每个图像的原始视角。同时，在全局上，试图通过为图像寻找合适的比例和旋转来保持良好的结构。两者都有助于拼接的自然性。因此，我们的能量函数由三个项组成：对齐项$\Psi_a$，局部相似项$\Psi_l$和全局相似项$\Psi_g$。

**对齐项**$\Psi_a$。该术语通过使匹配点与其对应关系对齐来确保变形后的对齐质量。它被定义为

$$
\Psi_a({\rm V}) = \sum^N_{i=1}\sum_{(i,j)\in {\rm J}}\sum_{p^{ij}_{k}\in {\rm M}^{ij}}\| \tilde{v}(p^{ij}_k)-\tilde{v}(\Phi(p^{ij}_k))\| ^2 \tag{1}
$$

其中$\Phi(p)$返回给定匹配点$p$的对应关系点。函数$\tilde{v}(p)$将$p$的位置表示为四个顶点位置的线性组合$\sum^4_{i=1} \alpha_i \tilde{v_i}$，其中$\tilde{v}_i$表示$p$所在的四边形的四个角，$\alpha_i$是相应的双线性权重。

**局部相似项**$\Psi_l$。该项用于正则化，并且将对齐约束从重叠区域传播到非重叠区域。我们对这个术语的选择是确保每个四边形经历一个相似变换，以便形状不会过度扭曲。
$$
\Psi_l({\rm V}) = \sum^N_{i=1} \sum_{(j,k)\in {\rm E}_i}\| (\tilde{v}^i_k - \tilde{v}^i_j) - {\rm S}^i_{jk}(v^i_k-v^i_j)\| ^2 \tag{2}
$$

其中$v^i_j$是原始顶点的位置，而$\tilde{v}^i_j$表示变形后顶点的位置。${\rm S}_{jk}^i$是边$(j,k)$的相似变换，可以表示为

$$
\begin{align}
{\rm S}^i_{jk}=
    \begin{bmatrix}
        c(e^i_{jk})\ s(e^i_{jk}) \\
        -s(e^i_{jk})\ c(e^i_{jk})
    \end{bmatrix} \tag{3}
\end{align}
$$

系数$c(e^i_{jk})$和$s(e^i_{jk})$可以表示为顶点变量的线性组合。细节可见[^8]。

**全局相似项**$\Psi_g$。该项要求每个变形图像尽可能经过相似地变换。这对于拼接图像的自然性至关重要。简而言之，如果没有该项，拼接结果可能是倾斜且非均匀变形的，如AANAP和SPHP所示（图4和图5）。此外，它消除了$v^j_i=0$的一般解。确定适当的比例和旋转的过程在第4节中描述。假设我们已经确定了图像$I_{i}$的期望缩放比例$s_{i}$和旋转角$\theta_i$。全局相似性定义为
$$
\Psi_g({\rm V})=\sum^N_{i=1}\sum_{e^i_j\in {\rm E}_i}w(e^i_j)^2[(c(e^i_j)-s_i\cos\theta_i)^2 + (s(e^i_j)-s_i\sin\theta_i)^2] \tag{4}
$$

这需要为$I_i$中每个边$e^i_j$的做相似变换，类似于我们为$I_i$确定的相似变换。函数$c(e)$和$s(e)$返回如等式3中所述的输入边$e$的相似变换的系数的表达式。权重函数$w(e^i_j)$将更多权重分配给远离重叠区域的边界。对于重叠区域中的四边形，对齐起着更重要的作用。另一方面，对于远离重叠区域的边缘，因为没有对齐约束，所以先验相似性更重要。具体而言，$w(e^i_j)$定义为

$$
w(e^i_j)=\beta+\frac{\gamma}{|Q(e^i_j)|}\sum_{q_k \in Q(e^i_j)}{\frac{d(q_k,{\rm M}^i)}{\sqrt{R^2_i+C^2_i}}} \tag{5}
$$

其中$\beta$和$\gamma$是控制该项权重的常数；$Q(e^i_j)$是共享边$e^i_j$的四边形集合（1或2个四边形，取决于边是否在网格的边界上）；${\rm M}^i$表示$I_i$的重叠区域中的四边形组；函数$d(q_k, {\rm M}^i)$返回四边形$q_k$到网格空间中重叠区域中的四边形的距离；$R_i$和$C_i$表示$I_i$的网格网格中的行数和列数。概括而言，边缘的权重与边缘到网格空间中重叠区域的归一化距离成比例。

​ 网格的最佳变形由以下因素确定：

$$
{\rm \tilde{V}}=\arg\min_{\rm{\tilde{V}}}{\Psi_a}({\rm V})+\lambda_l\Psi_l({\rm V})+\Psi_g({\rm V}) \tag{6}
$$

注意，在$\Psi_g$中有两个参数，$\beta$和$\gamma$，控制全局相似项的相对重要性。在我们的所有实验中，我们设置$\lambda_l= 0.56$，$\beta=6$和$\gamma= 20$。根据经验，我们发现参数非常稳定，因为各项之间没有严重的冲突。优化可以通过稀疏线性求解器有效地求解。

## 4 缩放和旋转选择

本节描述如何确定每个图像$I_i$的最佳尺度$s_i$和旋转角度$\theta_i$，这是缝合结果自然性的关键。

### 4.1 焦距估计和3D旋转

我们通过改进AutoStitch[^2]提出的束调整方法来估计每个图像的焦距和3D旋转角度。我们以两种方式改进他们的方法：更好的初始化和更好的点匹配。更好的初始化改善了方法的收敛性。

从两幅图像之间的单应性，我们可以估计两幅图像[^17][^16][^18]的焦距。在执行APAP之后，我们对网格的每个四边形都有一个单应性。因此，每个四边形给出一个对图像焦距的估计。我们将这些估计的中值作为焦距的初始化并形成$I_i$的初始内在矩阵${\rm K}_i$。一旦我们得到${\rm K}_i$，我们通过最小化以下投影误差获得$I_i$和$I_j$之间的3D旋转${\rm R}_{ij}$的初始估计：

$$
{\rm R}_{ij} = \arg \min_{\rm R} \sum_{p^{ij}_k \in {\rm M}^{ij}} \| {\rm K}_j {\rm R} {\rm K}^{-1}_i p^{ij}_k - \Phi(p^{ij}_k) \|^2 \tag{7}
$$

它可以通过SVD解决。请注意，AutoStitch使用特征点及其匹配来估计两个图像之间的3D旋转。特征点的问题在于它们不均匀地分布在图像空间中并且可能具有不利影响。我们使用匹配点而不是特征点来估计3D旋转。

随着${\rm K}_i$和${\rm R}_{ij}$的更好初始化，执行束调整可获得每个图像$I_i$的焦距$f_i$和3D旋转${\rm R}_i$。等式4中$I_i$的标度$s_i$可以设置为

$$
s_i=f_0/f_i \tag{8}
$$

| ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417135309006.png "图3(a)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417135324408.png "图3(b)") |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|                          (a) AANAP                           |                   (b) 我们的结果（3D方法）                   |

图3 AANAP没有选择正确的旋转(a)。我们的方法做得更好，产生了更自然的结果。

### 4.2 旋转角度的选择

正如第1节所述，尽管旋转角度的选择对于自然性至关重要，但很少有人关注它。AutoStitch假设用户很少相对于地平线扭曲相机，并且可以通过计算上矢量[^2]来拉直波浪状全景图。AANAP使用特征匹配来确定最佳相似性变换[^11]。启发式方法不够鲁棒，如图3所示。

旋转选择的目的是为每个图像$I_i$分配旋转角$\theta_i$。我们提出了几种确定旋转的方法，2D方法和3D方法。在描述这些方法之前，我们首先定义几个术语。

**相对旋转范围。**给定一对相邻图像$I_i$和$I_j$，其每对匹配点唯一地确定相对旋转角。假设第$k$对匹配点给出了相对旋转角$\theta^{ij}_k$。我们将$I_i$和$I_j$之间的相对旋转范围$\Theta^{ij}$定义为
$$
\Theta^{ij}=[\theta^{ij}_{min}, \theta^{ij}_{max}] \tag{9}
$$

此处$\theta_{min}^{ij}=\min_k\theta_{k}^{ij}$并且$\theta_{max}^{ij} = \max_k\theta_{max}^{ij}$。

**最小线段失真旋转（MLDR）**。人类对线条更敏感。因此，我们提出了一个步骤，用于找到相对于线对齐的两个相邻图像之间的最佳相对旋转。我们首先使用LSD检测器[^6]检测线。通过APAP给出的对齐，我们可以找到两个相邻图像$I_i$和$I_j$之间的线的对应关系。每对对应线唯一地确定一个相对旋转角度。我们使用RANSAC作为一种强大的投票机制来确定$I_i$和$I_j$之间的相对旋转角度。每条线的投票权取决于其长度和宽度的乘积。最终的相对旋转角度被视为所有内部旋转角度的平均值。我们将$\phi^{ij}$表示为由MLDR确定的$I_{i}$和$I_j$之间的相对旋转角。

给定由MLDR估计的所有相对旋转角$\phi^{ij}$，我们可以找到一组旋转角$\{\theta_i\}$以尽可能地满足MLDR成对旋转关系。我们将$\theta_{i}$表示为单位2D矢量$(u_i,v_i)$并表示以下能量函数：

$$
{\rm E}_{MLDR}=\sum_{(i,j)\in {\rm J}}\Bigg\|
R(\phi^{ij})\begin{bmatrix} u_i \\ v_i\end{bmatrix} - \begin{bmatrix} u_j \\ v_j\end{bmatrix}
\Bigg\|^2 \tag{10}
$$

其中${\rm R}(\phi^{ij})$是由$\phi^{ij}$指定的2D旋转矩阵。通过最小化${\rm E}_{MLDR}$，我们找到一组旋转角度$\theta_{i}$以尽可能地满足MLDR成对旋转角度约束。为了避免这个简单的解决方案，我们需要至少一个约束来求解方程10。我们提出了两种方法来获得额外的约束。

**旋转选择（2D方法）。**在这种方法中，我们与Brown等人做出了类似的假设[^2]，假设用户很少相对于地平线扭曲相机。也就是说，如果可能的话，我们更喜欢$\theta_i=0^{\circ}$。首先，我们需要确定一个图像的旋转角度。在不失一般性的情况下，让参考图像的角度为$0^\circ$，即$\theta_0=0^\circ$。一旦对于某个图像$I_i$具有旋转角$\theta_i$，我们就可以通过$\Theta_j=\Theta^{ij}+\theta_i$确定与$I_i$相邻的图像$I_j$的旋转范围。如果$0^\circ$在$\Theta_j$范围内，则意味着零旋转是合理的，我们应该设置$\theta_j=0$。通过沿邻接图使用BFS传播旋转范围，我们可以找到一组旋转$0^\circ$的图像。详细过程的伪代码在补充材料中给出。设$\Omega$是旋转角度等于$0^\circ$的图像集合。我们通过最小化下列式子找到$\theta_i$
$$
\begin{align}
&{\rm E}_{MLDR}+\lambda_z{\rm E}_{ZERO}  \tag{11} \\
&{\rm E}_{ZERO}=\sum_{i\in\Omega}\Bigg\|
\begin{bmatrix} u_i \\ v_i \end{bmatrix} -
\begin{bmatrix} 1 \\ 0 \end{bmatrix}
\Bigg\|^2 \tag{12}
\end{align}
$$

并且$\lambda_z=1000$，使得$\Omega$中的图像可能被指定为零旋转，即保持它们的原始方向。

**旋转选择（3D方法）。**在此方法中，我们使用在本节开头估计的3D旋转矩阵${\rm R}_i$。我们首先分解3D旋转矩阵${\rm R}_i$以获得相对于$z$轴的旋转角$\alpha_i$。两个相邻图像$I_i$和$I_j$之间的相对旋转可以确定为$\alpha^{ij}=\alpha_j-\alpha_i$。如果$\alpha^{ij} \in \Theta^{ij}$，则意味着估计是合理的并且可以使用。否则，我们应该使用MLDR的相对旋转$\phi^{ij}$。设$\Omega$是使用$\phi^{ij}$的配对集，$\bar{\Omega}={\rm J}-\Omega$为其他部分。通过最小化确定旋转角度
$$
\sum_{(i,j)\in \Omega}\Bigg\|R(\phi^{ij}) \begin{bmatrix} u_i \\ v_i \end{bmatrix} -\begin{bmatrix} u_j \\ v_j \end{bmatrix} \Bigg \|^2 + \lambda_{\gamma} \sum_{(i,j)\in \bar{\Omega}} \Bigg\| R(\alpha^{ij}) \begin{bmatrix} u_i \\ v_i\end{bmatrix} - \begin{bmatrix} u_j \\ v_j \end{bmatrix} \Bigg\|^2 \tag{13}
$$

我们设置$\lambda_\gamma = 10$以给予3D旋转更多权重。

| (a)  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175032212.png "图4(a)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175515541.png "图4(a)") |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| (b)  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175149902.png "图4(b)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175633671.png "图4(b)") |
| (c)  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175154752.png "图4(c)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175710259.png "图4(c)") |
| (d)  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175204843.png "图4(d)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175851168.png "图4(d)") |
| (e)  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175404357.png "图4(e)")  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418180038446.png "图4(e)") |
| (f)  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175419077.png "图4(f)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418180100625.png "图4(f)") |
| (g)  | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418175424455.png "图4(g)") | ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200418180234432.png "图4(g)") |

图4所示。两图拼接的一个例子。(a) AutoStitch，(b) AutoStitch+ours，(c)APAP，(d) ASAP，(e) SPHP+APAP，(f) AANAP，(g) Ours (3D method)。

# 5 实验和结果

我们将方法（2D和3D版本）与四种方法进行比较，AutoStitch[^2]，APAP[^20]，SPHP[^4]和AANAP[^11]。实验在具有2.8GHz CPU和16GB RAM的MacBook Pro上进行。使用VLFeat[^19]提取SIFT特征。对于基于网格的方法，网格大小设为$40\times 40$。我们在42组图像上测试了6种方法（3种来自[^11]，6种来自[^4]，4种来自[^20]，7种来自[^14]，3种来自[^5]和19种我们自己收集）。所有比较都可以在补充材料中找到。图像数量从2到35不等。我们收集的测试集比现有测试集更具挑战性。我们将发布所有代码和数据以便于进一步比较。不考虑特征检测和匹配，对于$800\times 600$的分辨率，我们的方法需要0.1秒来拼接两个图像（图4）和8s用于35个图像（图6）。

图4比较了拼接两幅图像的所有方法。图4(a)显示了AutoStitch的结果。请注意，存在明显的错位。我们的方法可用于赋予其他具有APAP对齐能力的方法。图4(b)显示了很大程度上消除了未对准的结果。虽然具有良好的对准质量，但APAP存在透视畸变问题（图4(c)）。可以将APAP的视角模型改为相似模型，如ASAP，类似于Schaefer等人的方法[^15]。图4(d)显示了ASAP的结果。尽管相似模型在减少失真方面表现良好，但不能很好地对准（特写处）。此外，拼接结果将表现出具有倾斜和不均匀变形的伪影。SPHP存在不自然旋转的问题（图4(e)）。AANAP在这个例子中给出了一个合理的结果（图4(f)），但地板上的线条略微扭曲，如特写中更清楚地显示。在这个例子中，我们的方法具有最佳的缝合质量（图4(g)）。

图1给出了通过缝合18个图像获得全景图的示例。由于视野有限，SPHP在这个例子上失败了。APAP + BA通过将图像投影到圆柱体上来克服这个问题[^21]。然而，由于不正确的比例和旋转估计，结果表现出对图像的非均匀失真（图1(a)）。AANAP不会正确选择旋转和缩放。如图1(b)所示，误差会累积并显著地弯曲拼接结果。请注意，该问题不能通过全景图矩形化的方法[^7]来解决，因为它会在不参考原始图像的情况下尽可能地保持输入全景的原始方向。全景图可以变成矩形但场景仍然是弯曲的。我们的结果（图1(c)）看起来更自然，因为它可以正确选择比例和旋转角度。我们的方法很灵活，可以扩展以符合一些其他约束。在这个例子中，我们使用消失点检测方法[^10]来检测一个图像的水平线。通过这个附加约束，拼接图像更好地与地平线对齐，以获得更自然的结果（图1(d)）。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417140621565.png "图5")

图5所示。六张图片拼接样例。(左上)AutoStitch，(左下)SPHP+APAP，(右上)AANAP，(右下)我们的结果（2D方法）。

在图5中拼接六个图像的示例中，AutoStitch由于其球形投影（左上角）而引入明显的失真。SPHP无法处理图像之间的2D拓扑并导致失真（左下）。AANAP的结果表现出不自然的旋转和形状扭曲（右上）。我们的结果在所有结果中看起来最自然（右下）。图6的输入包含35个图像。AutoStitch受到球形投影（左上角）引起的失真的影响。AANAP在整个图像上都有扭曲（右上角）。我们的两种方法都能提供更自然的结果。2D方法更好地保持每个图像的透视（左下），而3D方法保持原始场景的更好的3D透视（右下）。

总之，虽然ASAP，AANAP，SPHP和我们的方法都使用相似性，但我们的方法给出了更好的结果。差异来自于如何利用相似性。SPHP尝试减少视角失真，但是当视野宽广（图1）并且图像之间的空间关系是2D（图5）时，它会失败。AANAP试图解决不自然的旋转，但它不够稳健而且经常失败（图1(b)，图3和图5）。此外，AANAP不会优化形状失真，它一次只能拼接两个图像。拼接多个图像时可能存在局部失真（图4(f)，图5和图6）。我们的方法比以前的方法更好地解决了所有这些问题。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/图像拼接NISwGSP论文阅读笔记/image-20200417140955934.png "图6")

图6所示。这是一个拼接35张图片的例子。(左上)AutoStitch，(右上)AANAP，(左下)2D方法，(右下)3D方法。

# 6 结论

本文提出一种图像拼接方法，用于合成自然结果。我们的方法采用局部变形模型。通过添加全局先验相似性，我们的方法可以在保持良好对齐的同时减少失真。更重要的是，借助我们的缩放尺度和旋转角度选择方法，全局先验相似性会产生更自然的拼接图像。
本文提出了两个主要的贡献。第一，它提出了一种结合APAP的对齐精度和更小相似度失真的方法。尽管可以探究各个部分，但我们以不同的方式利用它们。该方法也可以处理多个图像的自然对齐。第二，它提出了用于稳健估计图像间的恰当地相似性变换的方法。它们有两个目的：进一步在局部加强相似性并建立良好的全局结构。实验证实了该方法的有效性和鲁棒性。

# 参考文献

[^1]:Brown M, Lowe D G. Recognising panoramas[C]//ICCV. 2003, 3: 1218.

[^2]:Brown M, Lowe D G. Automatic panoramic image stitching using invariant features[J]. International journal of computer vision, 2007, 74(1): 59-73.

[^3]:Carroll R, Agrawal M, Agarwala A. Optimizing content-preserving projections for wide-angle images[C]//ACM Transactions on Graphics (TOG). ACM, 2009, 28(3): 43.

[^4]:Chang C H, Sato Y, Chuang Y Y. Shape-preserving half-projective warps for image stitching[C]//Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2014: 3254-3261.

[^5]:Gao J, Kim S J, Brown M S. Constructing image panoramas using dual-homography warping[C]//CVPR 2011. IEEE, 2011: 49-56.

[^6]:Von Gioi R G, Jakubowicz J, Morel J M, et al. LSD: a line segment detector[J]. Image Processing On Line, 2012, 2: 35-55.

[^7]:He K, Chang H, Sun J. Rectangling panoramic images via warping[J]. ACM Transactions on Graphics (TOG), 2013, 32(4): 1-10.

[^8]:Igarashi T, Igarashi Y. Implementing as-rigid-as-possible shape manipulation and surface flattening[J]. journal of graphics, gpu, and game tools, 2009, 14(1): 17-30.

[^9]:Kopf J, Lischinski D, Deussen O, et al. Locally adapted projections to reduce panorama distortions[C]//Computer Graphics Forum. Oxford, UK: Blackwell Publishing Ltd, 2009, 28(4): 1083-1089.

[^10]:Lezama J, Grompone von Gioi R, Randall G, et al. Finding vanishing points via point alignments in image primal and dual domains[C]//Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2014: 509-515.

[^11]:Lin C C, Pankanti S U, Natesan Ramamurthy K, et al. Adaptive as-natural-as-possible image stitching[C]//Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2015: 1155-1163.

[^12]:Lin W Y, Liu S, Matsushita Y, et al. Smoothly varying affine stitching[C]//CVPR 2011. IEEE, 2011: 345-352.

[^13]:Lowe D G. Distinctive image features from scale-invariant keypoints[J]. International journal of computer vision, 2004, 60(2): 91-110.

[^14]:Nomura Y, Zhang L, Nayar S K. Scene collages and flexible camera arrays[C]//Proceedings of the 18th Eurographics conference on Rendering Techniques. 2007: 127-138.

[^15]:Schaefer S, McPhail T, Warren J. Image deformation using moving least squares[M]//ACM SIGGRAPH 2006 Papers. 2006: 533-540.

[^16]:Shum H Y, Szeliski R. Panoramic image mosaics[R]. Technical Report MSR-TR-97-23, Microsoft Research, 1997.

[^17]:Szeliski R. Image alignment and stitching: a tutorial, foundations and trends in computer graphics and computer vision[J]. Now Publishers, 2006, 2(1): 120.

[^18]:Szeliski R, Shum H Y. Creating full view panoramic image mosaics and environment maps[C]//Proceedings of the 24th annual conference on Computer graphics and interactive techniques. 1997: 251-258.

[^19]:Vedaldi A, Fulkerson B. VLFeat: An open and portable library of computer vision algorithms[C]//Proceedings of the 18th ACM international conference on Multimedia. 2010: 1469-1472.

[^20]:Zaragoza J, Chin T J, Brown M S, et al. As-projective-as-possible image stitching with moving DLT[C]//Proceedings of the IEEE conference on computer vision and pattern recognition. 2013: 2339-2346.

[^21]:Zaragoza J, Tat-Jun C, Tran Q H, et al. As-Projective-As-Possible Image Stitching with Moving DLT[J]. IEEE transactions on pattern analysis and machine intelligence, 2014, 36(7): 1285.

[^22]:Zelnik-Manor L, Peters G, Perona P. Squaring the circle in panoramas[C]//Tenth IEEE International Conference on Computer Vision (ICCV'05) Volume 1. IEEE, 2005, 2: 1292-1299.
