## 排序算法（Javascript）

排序算法是计算机科学与数学中最基本的算法之一，是一种将一组数据依照特定排序方式进行排列的算法。

一般有以下几种常用算法：

* 检索：在数据结构里查找满足一定条件的节点；
* 插入：往数据结构中增加新的节点；
* 删除：把指定的结点从数据结构中去掉；
* 更新：改变指定节点的一个或多个字段的值；
* 排序：**把节点按某种指定的顺序重新排列，例如，递增或递减。**

本文总结了一些排序算法，给出了算法描述、原理示意图（来源于网络），并给出算法的 Javascript 代码的实现和简单实测。

### 排序算法的几个概念

#### 时间复杂度

在计算机科学中，算法的时间复杂度是一个函数，它定性描述该算法的运行时间，即执行当前算法所消耗的时间。

时间复杂度常用大写 O 符号表述，公式是：T(n) = O( f(n) )，不包括函数的低阶项和首项系数。使用这种方式时，时间复杂度可被称为是**渐近的**，即输入值大小趋近无穷时的情况。

例如，一个算法的执行时间是 T(n) =  5n^3 + 3n，那么它的渐近时间复杂度是 O(n^3)。

常见的时间复杂度量级：

- 常数阶 O(1)；
- 对数阶 O(logN)：T(n) = log2^n，则时间复杂度为 O(logn)；
- 线性阶 O(n)；
- 线性对数阶 O(nlogN)；
- 平方阶 O(n^2)；
- 立方阶 O(n^3)；
- K次方阶 O(n^k)；
- 指数阶 (2^n)。

#### 空间复杂度

类似时间复杂度，空间复杂度是对一个算法在运行过程中所占用存储空间大小的量度，记做 S(n) = O( f(n) )，也是渐近的。

#### 排序方式

排序算法可以分为内部排序和外部排序，内部排序是在数据记录的内存中进行排序，即 S(n) = O(1)，而外部排序是因排序的数据很大，一次不能容纳全部的排序记录，在排序过程中需要访问外存，即 S(n) >> O(1)。

#### 稳定性比较

假如在待排序数组中，存在多个具有相同关键字的元素，经过排序，这些元素的相对顺序保持不变，即在原数组中，a = b，且 a 在 b 之前，且在排序后的数组中，a 仍在 b 之前，则称这种排序算法是稳定的；否则称为不稳定的。

#### 算法概括

| 排序算法 | 最好情况 | 最坏情况 | 平均时间复杂度 | 空间复杂度 | 排序方式 | 是否稳定 |
| -------- | -------------- | ---------- | -------- | -------- | -------- | -------- |
| 冒泡排序 | O(n)         | O(n^2)   | O(n^2)         |O(1)|内|稳定|
| 选择排序 | O(n^2) | O(n^2) | O(n^2) |O(1)|内|不稳定|
| 插入排序 | O(n) | O(n^2) | O(n^2) |O(1)|内|稳定|
| 快速排序 | O(nlogn) | O(n^2) | O(nlogn) |O(logn)|内|不稳定|
| 希尔排序 | O(n^1.3) | O(n^2) | 约O(n^3/2)     |O(1)|内|不稳定|
| 归并排序 | O(nlogn) | O(nlogn) | O(nlogn) |O(n)|外部|稳定|
| 堆排序 | O(nlogn) | O(nlogn) | O(nlogn) |O(1)|内|不稳定|
| 计数排序 | O(n+k)   | O(n+k) | O(n+k) |O(k)|外部|稳定|
| 桶排序 | O(n)   | O(n+k) | O(n^2) |O(n+k)|外部|稳定|
| 基数排序 | O(n*k)   | O(n*k) | O(n*k) |O(n+k)|外部|稳定|

### 冒泡排序

冒泡排序是一种简单直观的排序算法。

冒泡排序的原理是重复地遍历待排序的数组，对相邻的元素进行两两比较，顺序相反则进行交换，这样，每一趟会将最小或最大的元素“浮”到顶端，重复地进行直到没有元素需要交换。

#### 算法描述（以递增为例）

* 比较相邻的元素，如果第一个比第二个大，就交换他们两个；
* 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样，最后的元素会是最大的元素；
* 针对所有的元素重复以上的步骤，除了最后一个。

![bubblesort.gif](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/bubblesort.gif)

#### 算法源码

```javascript
function bubbleSort (arr) {
    const len = arr.length
    let temp
    for (let i = 0; i < len; i ++) {
        for (let j = 0; j < len - 1 - i; j ++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
            console.count()
        }
    }
    return arr
}
var array = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
bubbleSort(array)
```

#### 算法优化

冒泡排序还有一种优化算法，比如，数组 [5, 4, 3, 2, 1, 6, 7, 8, 9, 10]，第一次遍历后，发现最后一次交换元素是在 6 之前，也就是 6 及以后的元素是已经有序的。

因此，有可以优化的思路：在每次遍历时，记录最后一次进行交换的位置，下一次遍历时，只要遍历该位置之前的元素即可。

```javascript
function bubbleSort2 (arr) {
    let i = arr.length - 1
    let position
    let temp
    while ( i > 0) {
        position = 0
        for (let j = 0; j < i; j ++) {
            if (arr[j] > arr[j+1]) {
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                position = j
            }
        }
        i = position
    }
    return arr
}
bubbleSort2(array)
bubbleSort2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
```

#### 算法分析

* 最佳情况：T(n) = O(n)，待排序数组**有序**；
* 最差情况：T(n) = O(n^2)，待排序数组**反序**；
* 平均情况：T(n) = O(n^2)；
* 空间复杂度：S(n) = O(1) 。

### 选择排序

选择排序是最简单直观的一种算法，基本思想是每一趟遍历，从待排序数组中选择一个最小（或最大）的元素作为首元素，直到所有元素排完为止。

#### 算法描述

* 在未排序数组（初始时，就是整个待排序数组）中找到最小（大）元素，放到已排序数组的末尾（初始时，已排序数组为空）；
* 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序数组的末尾；
* 重复第二步，直到所有元素排序完毕。

![selectionsort.gif](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/selectionsort.gif)

#### 算法源码

```javascript
function selectionSort (arr) {
    const len = arr.length
    let index
    let temp
    for (let i = 0; i < len - 1; i ++) {
        index = i
        for (let j = i + 1; j < len; j ++) {
            if (arr[j] < arr[index]) {
                index = j
            }
        }
        temp = arr[i]
        arr[i] = arr[index]
        arr[index] = temp
    }
    return arr
}
selectionSort(array)
```

#### 算法分析

选择排序是一种简单直观的排序算法，无论什么数据进去都是 O(n^2) 的时间复杂度。所以用到它的时候，数据规模越小越好。

选择排序是不稳定排序，因此每次找最大（小）元素都要和前面的元素进行交换，会破坏稳定性，如，[3^, 3, 2]，第一次找到最小元素 2 与第一元素 3^ 交换，排序结果 [2, 3, 3^]，这样两个 3 的相对顺序就不是原来的了。

相比冒泡排序，选择排序的唯一优点是，元素交换的次数可能较少。

* 最佳情况：T(n) = O(n2)；

* 最差情况：T(n) = O(n2)；

* 平均情况：T(n) = O(n2)；
* 空间复杂度：S(n) = O(1) 。

### 插入排序

插入排序是一种最简单的排序方法，一般也被称为直接插入排序。

插入排序的基本思想是每次遍历将一个未排序数组的元素插入到已排序好的数组中，每次遍历后，有序数组元素加 1，未排序数组元素减 1，直到未排序数组为空。

#### 算法描述（以递增为例）

* 将待排序数组第一个元素看做一个已排序好的数组，把第二个元素到最后一个元素当成是未排序的数组；

* 取出未排序数组中的第一个元素 R，然后在已排序好的数组中从后向前扫描；
* 如果当前扫描的元素大于 R，则将该元素后移一位，继续向前扫描；
* 如果当前扫描的元素大于或等 R，则将 R 插入到该元素后面，R 排序完成，停止扫描，同时，有序数组元素加 1，未排序数组元素减 1；
* 重复 2 ~ 4 步，直到未排序数组为空。

![insertionsort.gif](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/insertionsort.gif)

#### 算法源码

```javascript
function insertionSort (arr) {
    const len = arr.length
    let temp
    let index
    for (let i = 1; i < len; i ++) {
        temp = arr[i]
        index = i
        while (index > 0 && arr[index - 1] > temp) {
            arr[index] = arr[index - 1]
            index --
        }
        arr[index] = temp
    }
    return arr
}
insertionSort(array)
```

#### 算法优化

插入排序的一种优化是利用二分查找的方式，找到正确的插入位置。（？？没理解，性能提升不多？？）

```javascript
function insertionSort2 (arr) {
    let temp
    let left
    let right
    let middle
    for (let i = 1; i < arr.length; i ++) {
        temp = arr[i]
        left = 0
        right = i - 1
        while (left <= right) {
            middle = Math.floor((left + right) / 2)
            if (arr[middle] > temp) {
                right = middle - 1
            } else {
                left = middle + 1
            }
            console.count()
        }
        for (let j = i - 1; j >= left; j--) {
            arr[j + 1] = arr[j]
        }
        arr[left] = temp
    }
    return arr
}
insertionSort2(array)
```

#### 算法分析

- 最佳情况：T(n) = O(n)，待排序数组有序；
- 最坏情况：T(n) = O(n^2)，待排序数组反序；
- 平均情况：T(n) = O(n^2)；
- 空间复杂度：S(n) = O(1) 。

### 快速排序

快速排序由 C. A. R. Hoare 在 1960 年提出，其特点是快、效率高，是处理大数据最快的排序算法之一。

快速排序采用 **分而治之** 的思想，通过一趟排序将待排序数组分割成两个子数组，其中一个子数组的所有元素都比另一个子数组的所有元素都要小，然后再按此方法对这两个子数组分别进行排序，整个排序过程可以递归进行。

#### 算法描述（以递增为例）

* 选基准：从数组中挑出一个元素，称为 ”基准”（pivot）；
* 划分区：遍历数组，将所有元素比基准值小的排在基准前面，将所有元素比基准值大的排在基准的后面（相同的数可以到任一边），这样，基准就处于两个数组之间连接的位置；
* 递归：递归排序两个子数组，即递归调用第 1 步和第 2 步的算法，直到子数组只剩下一个元素为止。

如果每次划分时，都能将数组分成两个等长的子数组，那么快速算法效率会达到最大，也就是说，基准的选择是很重要的，它决定划分后两个子数组的长度，进而对整个算法的效率产生决定性影响。

基准的选择方式有：固定位置（以最左或最右为基准）、取中间位为基准、随机选取基准。

以下是以最右侧元素为基准的排序动态图：

![12585785-441c7bdc9262cf20.gif](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/12585785-441c7bdc9262cf20.gif)

#### 算法源码

快速排序最佳的划分是将待排序的数组分成等长的子数组，也就是基准恰好是整个数组的中间的值，但是，这个基准很难算出来。上述选择基准的方式，随机选取基准并没有多大的帮助，一般的做法是使用最左端、最右端或中间位的元素作为基准，而采用中间位为基准，可消除预排序输入的不好情形，并且减少大约 14% 的比较次数。

实现步骤如下（以递增为例）：

* 取中间位元素为基准，由左右两端向中间扫描；
* 左端从第一个元素开始：如该元素小于基准，继续向右，扫描后面一位，否则停在该元素上；
* 右端从最后一个元素开始：如该元素大于基准，继续向左，扫描前面一位，否则停在该元素上；
* 如果左端所停的元素的位置小于等于右端所停的元素的位置，交换左右端元素，继续向中间扫描；
* 直到左端所停的元素的位置大于右端所停的元素的位置，则排序完成。

```javascript
function partition(arr, left, right) {
    const pivot = arr[Math.floor((right + left) / 2)]
    let i = left
    let j = right
    let temp
    while (i <= j) {
        while (arr[i] < pivot) {
            i ++
        }
        while (arr[j] > pivot) {
            j --
        }
        if (i <= j) {
            temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            i ++
            j --
        }
    }
    return i
}
```

```javascript
const array = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
partition(array, 0, array.length - 1)

// 基准： array[Math.floor((0 + array.length - 1) / 2)] = 26
[3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48] // 交换：44 19
[3, 19, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 44, 50, 48] // 交换：38 4
[3, 19, 4, 5, 47, 15, 36, 26, 27, 2, 46, 38, 44, 50, 48] // 交换：47 2
[3, 19, 4, 5, 2, 15, 36, 26, 27, 47, 46, 38, 44, 50, 48] // 交换：36 26
[3, 19, 4, 5, 2, 15, 26, 36, 27, 47, 46, 38, 44, 50, 48] // 完成
// 返回值：7，即排序完成后 36 所在位置
```

快速排序递归源码：

```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
    const index  = partition(arr, left, right)
    if (left < index - 1) {
        quickSort(arr, left, index - 1)
    }
    if (index < right) {
        quickSort(arr, index, right)
    }
    return arr
}
```

#### 算法分析

快速排序的平均运行时间是 O(nlogn)，之所以特别快是由于非常精练和高度优化的内部循环，最坏的情形性能为 O(n^2)。另外，从空间性能上看，它只需要一个元素的辅助空间，但它需要一个栈空间来实现递归，所以，空间复杂度 O(logn)。

- 最佳情况：T(n) = O(nlogn)，每次划分都能正好将数组平分；
- 最坏情况：T(n) = O(n^2)，待排序数组有序，且取最后一个元素为基准；
- 平均情况：T(n) = O(nlogn)；
- 空间复杂度：S(n) = O(logn) 。

### 希尔排序

希尔排序是希尔（Donald Shell）于1959年提出的一种排序算法，是插入排序经过改进之后的一个更高效的版本，也称为缩小增量排序，同时也是冲破 O(n^2）的第一批算法之一。

希尔排序是按一定的增量对数组进行分组，然后在每一个分组中做插入排序，然后逐次缩小增量，直到增量等于 1，也就是说，最后一次排序实际是对整个数组的一次插入排序。

希尔排序的核心在于**增量序列**的选择，这是个数学难题。常用的增量 `gap = length / 2`，缩小增量继续以 `gap = gap / 2` 的方式，可以获得一个序列 `{ n/2, (n/2)/2 ... 1 }`，称为增量序列。这是 Shell 建议的增量，称为希尔增量，但这个增量序列不是最优的。

#### 算法描述（以递增为例）

* 选择一个增量序列，如 `{n/2, (n/2)/2 ... 1}`；
* 对每个增量进行 1 趟排序；
* 每趟排序，根据对应的增量，将待排序数组分割成若干子数组，分别对各子数组进行插入排序。当增量为 1 时，其实就相当于对整个数组插入排序，但由于之前增量的一次次排序，此时的数组已经基本有序，最后的插入排序只需少量元素移动、交换即可。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/1024555-20161128110416068-1421707828.png)

#### 算法源码

```javascript
function shellSort(arr) {
    const len = arr.length
    let gap = Math.floor(len / 2)
    let temp
    while(gap) {
        for(let i = gap; i < len; i ++) {
            for(let j = i - gap; j >= 0; j -= gap) {
                if(arr[j] > arr[j + gap]) {
                    temp = arr[j]
                    arr[j] = arr[j + gap]
                    arr[j + gap] = temp
                }
            }
        }
        gap = Math.floor(gap / 2)
    }
    return arr
}
```

#### 算法分析

希尔排序时间复杂度是 O(n^(1.3-2))，空间复杂度为常数阶 O(1)。希尔排序没有时间复杂度为 O(n(logn)) 的快速排序算法快 ，因此，对中等规模的数据排序表现良好，对大规模的数据排序不是最优选择，但总体来说，比 O(n^2 ) 复杂度的算法快得多。

- 最佳情况：T(n) = O(nlogn)；
- 最坏情况：T(n) = O(n^2)，gap =1 时；
- 平均情况：不确定；
- 空间复杂度：S(n) = O(1) 。

### 归并排序

归并排序采用经典的**分治策略**，其实现可分为两个阶段：分和治，也就是将 n 个元素的数组拆分成 n 个只有一个元素的数组，然后不断地两两合并，直到将所有元素合到一个数组，排序完成。

归并排序的思想是基于两个已经排序的数组合并，要比从头开始排序所有元素来得快。

因此，可以将数组拆开，分成n个只有一个元素的数组，然后不断地两两合并，直到全部排序完成。

**分阶段**就是递归拆分数组，直到数组无法再拆分（只有 1 个元素时），递归深度为 log2n。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/1024555-20161218163120151-452283750.png)

**治阶段**是将两个已经有序的子数组合并成一个有序数组，直到所有元素最终合并到一个有序数组。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/1024555-20161218194508761-468169540.png)

#### 算法描述

* 将长度为 n 的待排序数组拆分成两个长度为 n/2 的子数组，然后递归拆分，直到无法再拆；
* 对两个子序列分别采用归并排序算法，合并成一个有序序列；
* 归并排序算法实现：创建一个新序列，然后比较两个数组的第一个元素，将较小的元素从数组移到新数组末尾，直到其中一个数组为空，再将另一个非空数组的元素逐个移到新数组末尾。

#### 算法源码

```javascript
function mergeSort(arr) {
    const len = arr.length
    if(len < 2) {
        return arr
    }
    const middle = Math.floor(len / 2)
    const left = arr.slice(0, middle)
    const right = arr.slice(middle)
    return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
    const result = []
    while (left.length > 0 && right.length > 0) {
        if (left[0] <= right[0]) {
            result.push(left.shift())
        } else {
            result.push(right.shift())
        }
    }
    while (left.length) {
        result.push(left.shift())
    }
    while (right.length) {
        result.push(right.shift())
    }
    return result
}
```

#### 算法分析

归并排序与选择排序类似，时间复杂度也是固定的，即最好、最坏、平均值都是一样的，但比选择排序效率高，T(n) = O(nlogn)，不过，归并排序需要占用更多空间，S(n) = O(n)。

- 最佳情况：T(n) = O(nlogn)；
- 最坏情况：T(n) = O(nlogn)；
- 平均情况：T(n) = O(nlogn)；
- 空间复杂度：S(n) = O(n) 。

### 堆排序

堆排序是指利用堆数据结构设计的一种排序算法。

堆是具有以下性质的完全二叉树：每个结点的值都大于或等于其左右孩子结点的值，称为大顶堆；或者每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/1024555-20161217182750011-675658660.png)

对大顶堆的结点按层进行编号，得到如下数组：

```javascript
[50, 45, 40, 20, 25, 35, 30, 10, 15]
```

完全二叉树中，**索引是 i 的结点对应的两个子结点的索引分别是 [2i+1, 2i+2]**，可以理解为满足以下条件的数组就是堆：

```shell
# 大顶堆
arr[i] >= arr[2i+1] && arr[i] >= arr[2i+2]  

# 小顶堆
arr[i] <= arr[2i+1] && arr[i] <= arr[2i+2]  
```

堆排序的基本思想是：将待排序数组构造成一个大顶堆，此时，整个数组的最大值就是堆顶的根节点，将其与堆底元素进行交换，然后，堆底就是最大元素。重新调整大顶堆，再交换堆顶元素和堆底元素，重复 n-1 次后就能得到一个升序的数组。

#### 算法描述

完全二叉树有个重要性质，对于最后一个非叶子节点的索引是 n/2-1 取整，其中索引是从 0 开始，n 是元素个数。

* 将无序序列构建成一个堆，根据升序降序需求选择大顶堆或小顶堆；

  构建过程：从最后一个非叶子节点（Math.floor(n / 2) - 1）开始，向前遍历所有非叶子节点；找出比该非叶子节点大的子节点，交换元素（如果子节点是非叶子节点，还要递归比较其子节点）；遍历完成可构成大顶堆。

* 将堆顶元素与末尾元素交换，将最大（小）元素"沉"到数组末端；

* 重新调整结构，使其满足堆定义，然后继续交换堆顶元素与当前末尾元素，反复执行调整、交换步骤，直到整个数组有序。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/03d5a55a1e6246a393897d1db330660e_tplv-k3u1fbpfcp-zoom-in-crop-mark_1304_0_0_0.awebp)

#### 算法源码

```javascript
function heapSort(arr){
    const len = arr.length
    const nonleaf = Math.floor(len / 2) - 1
    for(let i = nonleaf; i >= 0; i --){
        buildHeap(arr, i, len)
    }

    let temp
    for(let j = len - 1; j > 0; j --){
        temp = arr[0]
        arr[0] = arr[j]
        arr[j] = temp
        buildHeap(arr, 0, j)
    }
    return arr
}

function buildHeap(arr, i, len){
    const top = arr[i]
    const child = i * 2 + 1
    let index = i
    for(let k = child; k < len; k = k * 2 + 1){
        if( k + 1 < len && arr[k] < arr[k + 1]){
            k ++
        }
        if(arr[k] > top){
            arr[index] = arr[k]
            index = k
        }
    }
    arr[index] = top
}
```

#### 算法分析

堆排序主要由构建初始堆、交换堆顶元素和末尾元素、重建堆组成。其中构建初始堆经推导复杂度为 O(n)，在交换并重建堆的过程中，需交换 n-1次，而重建堆的过程中，根据完全二叉树的性质，[log2(n-1),log2(n-2)...1]逐步递减，近似为 nlogn。所以堆排序时间复杂度一般认为就是 O(nlogn) 级。

- 最佳情况：T(n) = O(nlogn)；
- 最坏情况：T(n) = O(nlogn)；
- 平均情况：T(n) = O(nlogn)；
- 空间复杂度：S(n) = O(1) 。

### 计数排序

计数排序是一个非基于比较的排序算法，该算法于1954 年由 Harold H. Seward 提出。它的优势在于在对**一定范围内的整数**排序时，它的时间复杂度为线性的 O(n+k)（其中 k 是整数的范围，即 max – min + 1），快于任何比较排序算法，这是一种典型的空间换时间的算法。

计数排序的**核心在于将输入的数据值转化为键，存储在额外开辟的新数组中**，新数组中第 i 个元素的值是待排序数组中值等于 i 的元素的个数，然后根据新数组将待排序数组中的元素排到正确的位置。计数排序要求**输入的数据必须是有确定范围的非负整数**。

#### 算法描述

* 找出待排序序列中最小的元素；
* 创建一个新数组，然后遍历待排序数组，以待排序数组中的元素的值减去最小元素数组的值作索引，以待排序数组中的元素出现次数作为新数组的元素值；
* 遍历新数组，找出其中元素值大于 0 的元素，将其对应的索引作为元素值，依次填充到原待排序数组中，每处理一次，新数组中的该元素值减 1，直到值为 0。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/countingSort.gif)

#### 算法源码

```javascript
function countSort(arr) {
    let min = arr[0]
    for (let k in arr) {
        min = arr[k] < min ? arr[k] : min
    }
    const count = []
    for (let num in arr) {
        if (!count[arr[num] - min]) {
            count[arr[num] - min] = 0
        }
        count[arr[num] - min] ++
    }

    let index = 0
    for (let i = 0; i < count.length; i ++) {
        while (count[i] && count[i] > 0) {
            arr[index] = i + min
            index ++
            count[i] --
        }
    }
    return arr
}
```

#### 算法分析

计数排序的时间复杂度与待排序数组的取值范围有关，它的时间复杂度是 O(n + k)。

由于用来计数的数组的长度取决于待排序数组中数据的范围，这使得计数排序对于数据范围很大的数组，需要大量内存，比如：对 [1, 10000000] 两个元素排序，但在小范围内的排序，计数排序是最好的算法，比如：0~100 之间数字的排序。

- 最佳情况：T(n) = O(n+k)；
- 最差情况：T(n) = O(n+k)；
- 平均情况：T(n) = O(n+k)；
- 空间复杂度：S(n) = O(k) 。

### 桶排序

桶排序算是计数排序的一个升级版，它利用特定函数的映射关系，将属于一定范围内的数据，放到同一个桶里，然后对每个桶中的数据进行排序（可采用上述的任意排序算法），最后再将排序好的数据拼接起来。

桶排序高效与否的关键就在于这个映射函数。为了使桶排序更加高效，需要做到这两点：

* 在额外空间充足的情况下，尽量增大桶的数量；
* 使用的映射函数能够将输入的 N 个数据**均匀**的分配到 K 个桶中。

#### 算法描述

* 设置一个合适长度的数组作为空桶；
* 遍历数组，根据特定函数，将数组中的元素都放到指定的桶中，分布的越均匀越好；
* 对每个非空的桶里的元素进行排序（比如，插入排序）；
* 将每个桶中排序好的元素拼接在一起。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/0bhd9g6dnt.gif)

#### 算法源码

```javascript
function bucketSort(arr, bucketSize) {
    let min = arr[0]
    let max = arr[0]
    for (let k in arr) {
        max = arr[k] > max ? arr[k] : max
        min = arr[k] < min ? arr[k] : min
    }

    const size = bucketSize || 5
    const count = Math.floor((max - min) / size) + 1
    const buckets = []
    for (let i = 0; i < count; i ++) {
        buckets[i] = []
    }

    for (let i = 0; i < arr.length; i ++) {
        buckets[Math.floor((arr[i] - min) / size)].push(arr[i])
    }

    arr.length = 0
    for (i = 0; i < count; i ++) {
        insertionSort(buckets[i])
        for (let j = 0; j < buckets[i].length; j ++) {
            arr.push(buckets[i][j])
        }
    }
    return arr
}
```

#### 算法分析

- 最佳情况：T(n) = O(n)，待排序元素均匀的分配到每一个桶；
- 最差情况：T(n) = O(n²)，待排序元素分配到同一个桶；
- 平均情况：T(n) = O(n + k)，k 表示桶的个数；
- 空间复杂度：S(n) = O(n + k)。

### 基数排序

基数排序是一种非比较型排序算法，其原理是将数值按位数切割成不同的数字，然后按每个位数分别比较。由于数值也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也**不是只能使用于整数**。

基数排序有两种方法：

* MSD：从高位开始进行排序；
* LSD：从低位开始进行排序。

#### 算法描述（以从低位开始为例）

* 取得待排序数组中的最大数，并取得其位数；
* 从最低位开始，将该位数相同的元素组成基数数组，最终会生成一个二维数组；
* 根据二维数组的一维索引循环，将二维数据的值，依次赋值回原待排序数组；
* 重复上面二步，直到最高位完成，排序结束。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/radixSort.gif)

#### 算法源码

理论上说，基数排序应该是可以适用于字符串和小数排序的，具体实现稍微复杂些，以下只针对非负整数排序：

```javascript
function radixSort(arr) {
    let max = arr[0]
    for (let k in arr) {
        max = arr[k] > max ? arr[k] : max
    }
    const maxDigit = (max + '').length

    const counter = []
    let mod = 10
    let dev = 1
    for (let i = 0; i < maxDigit; i ++, mod *= 10, dev *= 10) {
        for(let j = 0; j < arr.length; j ++) {
            let bucket = Math.floor((arr[j] % mod) / dev)
            if(!counter[bucket]) {
                counter[bucket] = []
            }
            counter[bucket].push(arr[j])
        }
        let index = 0
        for(let j = 0; j < counter.length; j ++) {
            if(counter[j] && counter[j].length) {
                let value = counter[j].shift()
                while (value || value === 0) {
                    arr[index] = value
                    index ++
                    value = counter[j].shift()
                }
            }
        }
    }
    return arr
}
```

#### 算法分析

基数排序基于分别排序、分别收集，所以是稳定的。但基数排序的性能比桶排序要略差，每一次关键字的桶分配都需要 O(n) 的时间复杂度，而且分配之后得到新的关键字序列又需要 O(n) 的时间复杂度。假如待排数据可以分为 d个关键字，则基数排序的时间复杂度将是 O(d*2n) ，当然 d 要远远小于 n，因此基本上还是线性级别的。

- 最佳情况：T(n) = O(n * k)；
- 最差情况：T(n) = O(n * k)；
- 平均情况：T(n) = O(n * k)；
- 空间复杂度：S(n) = O(n + k)，其中 k 为桶的数量，一般来说 n>>k。

### 总结

排序算法可以分为两大类：

* 比较类：也称非线性时间比较类排序，通过比较来决定元素排序，其时间复杂度不能突破 O(nlogn)。
* 非比较类：也称线性时间非比较类排序，不通过比较来决定元素排序，可以突破基于比较排序的时间下界，以线性时间运行。 

排序算法总结：

* 平方阶（O(n^2)）排序：冒泡排序、选择排序、插入排序。
* 线性对数阶（O(nlogn)）排序：快速排序、归并排序、堆排序。

* 时间复杂度固定的排序（与待排序序列顺序无关）：选择排序、归并排序、堆排序、计数排序、基数排序。
* 不稳定排序算法：选择排序、快速排序、希尔排序、堆排序。
* 数组元素基本有序的情况下，插入排序和优化后的冒泡排序是最好的，都只用比较 n-1 次。

### 相关问题

#### Javascript 的 sort 方法排序原理

sort() 方法对数组的元素进行排序，并返回数组。由于不同浏览器的具体实现有差异，因此无法保证排序的时间和空间复杂性。

```shell
arr.sort([compareFunction])
```

`compareFunction` 是一个用来指定数组按某种顺序进行排列的函数。

如果没有指明 `compareFunction` ，那么元素会先转换为的字符串，然后按字符串的 Unicode 位点进行排序。例如： "Banana" 会被排列到 "cherry" 之前，同样，如果比较数字 9 和 80，实际比较的是字符串 "9" 和 "80"，因此，按 Unicode 位点排序，字符串 "80" 要比 "9" 要靠前。

如果指明了 `compareFunction` ，那么数组会按照该函数的返回值排序：

* `compareFunction(a, b)` 小于 0：a 会被排列到 b 之前；
* `compareFunction(a, b)` 等于 0：a 和 b 的相对位置不变（ECMAScript 标准并不保证这一行为，这取决于浏览器的实现）；
* `compareFunction(a, b)`  大于 0：b 会被排列到 a 之前。

compareFunction(a, b) 必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。

以上返回值的说明来自 [MDN Array.prototype.sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description)。

```javascript
const array = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
array.sort((a, b) => {
    if (a < b ) { return -1 }
    if (a > b ) { return 1 }
    return 0
})
array.sort((a, b) => a - b)
```

起初，我对这些返回值说明并不理解，于是查阅了一些资料，发现要了解这些返回值的作用，需要先了解浏览器实现 sort 所采用的排序算法，于是整理总结了这篇与排序算法相关的文章，然后查看了 Chrome 的 V8 引擎的 sort 实现（不同 Js 引擎对 sort 实现可能存在差异）。

V8 引擎对 sort 方法提供了 2 种排序算法：插入排序、快速排序。

当数组长度小于等于 10 的时候，采用插入排序，大于 10 的时候，采用快速排序。当长度大于 1000 的数组，采用的是**快速排序与插入排序混合**的方式进行排序的，因为，当数据量很小的时候，插入排序效率优于快速排序。

V8 插入排序源码：

```javascript
var InsertionSort = function InsertionSort(a, from, to) {
    for (var i = from + 1; i < to; i++) {
        var element = a[i];
        for (var j = i - 1; j >= from; j--) {
            var tmp = a[j];
            var order = comparefn(tmp, element);
            if (order > 0) {
                a[j + 1] = tmp;
            } else {
                break;
            }
        }
        a[j + 1] = element;
    }
};
```

[chromium V8 引擎 array.js ](https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js#L710)

源码中的 `comparefn` 函数就是 sort 方法时传入的函数，`compareFunction(a, b)` 中的 a 对应的是 tmp，即已排序数组中的某个元素，b 对应的是 element，即待排序元素， `sort((a, b) => a - b)` 表示，已排序数组中**大于**待排序元素的元素往后移，即大元素在后，小元素在前，也就是递增排序。

```javascript
[3, 44, 38, 5, 4].sort((a, b) => a - b )
// 如果 a - b > 0, a 往后移一位
// 第一次遍历，a = 3, b = 44           无移动, 结果 [3, 44, 38, 5, 4]
// 第二次遍历，a = 3|44, b = 38,       44后移, 结果 [3, 38, 44, 5, 4]
// 第三次遍历，a = 3|38|44, b = 5,     38|44后移, 结果 [3, 5, 38, 44, 4]
// 第三次遍历，a = 3|5|38|44, b = 4,   5|38|44后移, 结果 [3, 4, 5, 38, 44]
```

同理， `sort((a, b) => b - a)` 表示，已排序数组中**小于**待排序元素的元素往后移，即小元素在后，大元素在前，也就是递减排序。

> 根据 V8 插入排序的源码，我认为如果 sort 传入函数 `(a, b) => -1` ，数组排序后应该是顺序不变，传入 `(a, b) => 1`，数组排序后应该是反序。
>
> 我将插入排序源码复制出来执行，也确实如此，但是直接传入 sort，排序结果刚好相反。？？没有通读整篇源码，未找到原因？？
>
> ```javascript
> var comparefn = (a, b) => -1
> function InsertionSort(a, from = 0, to = a.length) {
>     for (var i = from + 1; i < to; i++) {
>         var element = a[i];
>         for (var j = i - 1; j >= from; j--) {
>             var tmp = a[j];
>             var order = comparefn(tmp, element);
>             if (order > 0) {
>                 a[j + 1] = tmp;
>             } else {
>                 break;
>             }
>         }
>         a[j + 1] = element;
>     }
>     return a
> };
> InsertionSort([1, 2, 3, 4, 5, 6, 7, 8]);
> // [1, 2, 3, 4, 5, 6, 7, 8]
> 
> [1, 2, 3, 4, 5, 6, 7, 8].sort(comparefn);
> // [8, 7, 6, 5, 4, 3, 2, 1]
> ```

**注意：** 当排序非 ASCII 字符的字符串（如包含类似 e, é, è, a, ä 等字符的字符串）、一些非英语语言的字符串需要使用 `String.localeCompare`。

```javascript
const items = ['réservé', 'premier', 'cliché', 'communiqué', 'café', 'adieu']
items.sort((a, b) => a.localeCompare(b))
```

**注意：** 自 ES10（EcmaScript 2019）起，规范要求 `Array.prototype.sort` 为稳定排序，但在此之前的版本没有要求稳定性。

#### 计数排序、桶排序、基数排序的区别？

这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异：

* 计数排序：每个桶只存储单一键值；
* 桶排序：每个桶存储一定范围的数值；
* 基数排序：根据键值的每位数字来分配桶。

#### 为什么快速排序效率更高？

在实际使用中，应用最广泛的是快速排序。

首先从平均时间复杂度来看，快速排序是 O(nlogn)，冒泡排序、选择排序、插入排序基本趋向于 O(n^2)。

再从空间复杂度看，快速排序是 O(logn)，归并排序是 O(n)，计数排序是O(k)，桶排序和基数排序是 O(n+k)。

剩下的就是快速排序、希尔排序、堆排序。

**希尔排序**作为插入排序的拓展，对较大规模的排序都可以达到很高的效率，但目前未得出其精确的渐近时间。

**堆排序**利用了一种称为堆的数据结构，平均时间复杂度 O(nlogn) 。

**快速排序**虽然最坏运行情况是 O(n^2)，它的平均期望时间是 O(nlogn)，且 O(nlogn) 记号中隐含的常数因子很小，比时间复杂度稳定等于 O(nlogn) 的归并排序、堆排序要小很多。

事实上，目前还没有完美的排序算法，每个算法都有优点和缺点，即使是快速排序，也只是整体性能上优越，它也存在排序不稳定、需要辅助空间、对少量数据排序无优势等缺点。

### 参考资料

[runoob.com 十大经典排序算法](https://www.runoob.com/w3cnote/ten-sorting-algorithm.html)

[runoob.com 数据结构与算法](https://www.runoob.com/data-structures/data-structures-tutorial.html)

[图解排序算法(一)之3种简单排序(选择，冒泡，直接插入)](https://www.cnblogs.com/chengxiao/p/6103002.html)

[图解排序算法(三)之堆排序](https://www.cnblogs.com/chengxiao/p/6129630.html)

[图解排序算法(二)之希尔排序](https://www.cnblogs.com/chengxiao/p/6104371.html)

[图解排序算法(四)之归并排序](https://www.cnblogs.com/chengxiao/p/6194356.html)

[JavaScript：十大排序的算法思路和代码实现](https://segmentfault.com/a/1190000019304443)

[十大经典排序算法(javascript实现)](https://www.xiabingbao.com/post/sort/javascript-10-sort.html)

[Java实现十个经典排序算法（带动态效果图）](https://juejin.cn/post/6941757711332114445#heading-22)