## Three.js 基础实战：从画一个立方体开始，掌握 3D 世界

**Three.js 是一个用 JavaScript 编写的、对底层 WebGL API 进行封装和抽象的 3D 图形渲染引擎。**

浏览器的原生 3D 绘图能力是 **WebGL**（或未来的 WebGPU）。但 WebGL 的接口非常底层，是状态机模式，需要手动管理着色器、缓冲区、矩阵运算，代码繁琐且容易出错。Three.js 的本质，就是在这之上封装了一层**面向对象的、更符合开发者直觉的 JavaScript API**。

在图形学中，要把 3D 模型变成 2D 像素，需要经过顶点处理、光栅化、片元处理等一系列步骤。Three.js 的本质工作是**接管并编排这个渲染管线**。它会根据设置的相机、光源、材质，自动生成相应的着色器（Shader）代码，配置好 WebGL 的状态，并在每一帧调用 `drawArrays` 或 `drawElements` 指令，命令 GPU 完成绘图。

### 核心组成

一个 Three.js 应用由几个核心部分组成：场景、相机、渲染器、物体和光源。

* 场景（Scene）：一个容器，用于放置所有要显示在屏幕上的 3D 物体、光源和辅助对象。
* 相机（Camera）：定义了观察场景的视角。最常用的是透视相机，它模拟人眼效果，物体近大远小，适合大多数场景。
* 渲染器（Renderer）：负责把“场景”和“相机”组合起来，最终绘制到浏览器的画布上。WebGLRenderer 是最核心的渲染器。
* 物体（Mesh）：由几何体（如立方体、球体）和材质（如颜色、粗糙度、金属感）组合而成。
* 光源（Light）：让物体被看见并产生立体感。常见的有环境光（提供基础照明）、平行光（模拟太阳）、点光源（模拟灯泡）等。

### 核心概念映射

Three.js 的 API 和 WebGL 底层操作映射：

| WebGL                                   | Three.js                                   | 说明                        |
| :-------------------------------------- | :----------------------------------------- | :-------------------------- |
| `gl.createBuffer()` + `gl.bindBuffer()` | `new THREE.BufferGeometry()`               | 顶点缓冲区                  |
| `gl.uniformMatrix4fv()`                 | `mesh.position` + `mesh.rotation`          | position 改变，重新计算矩阵 |
| `gl.viewport()` + `gl.clear()`          | `renderer.setSize()` + `renderer.render()` | 画布调整，重新渲染          |
| `requestAnimationFrame`                 | `renderer.setAnimationLoop()`              | 动画                        |

### 第一个3D案例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Three.js</title>
  <style>
    body { margin: 0; overflow: hidden; }
  </style>
</head>
<body>
  <script type="importmap">
    {
      "imports": {
        "three": "./three.module.js",
        "OrbitControls": "./OrbitControls.js"
      }
    }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'OrbitControls';

    // 第1步：创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1a1a2e');

    // 第2步：创建透视相机
    // 参数: (视场角FOV, 宽高比, 近裁剪面, 远裁剪面)
    const camera = new THREE.PerspectiveCamera(
      75,                                     // FOV
      window.innerWidth / window.innerHeight, // Aspect Ratio
      0.1,                                    // Near
      1000                                    // Far
    );
    camera.position.z = 3;

    // 第3步：创建渲染器 (Renderer)
    // - new THREE.WebGLRenderer() 内部调用了 canvas.getContext('webgl')
    // - renderer.domElement 就是那个 canvas 元素
    // - setSize() 内部调用了 gl.viewport(0, 0, width, height)
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 开启抗锯齿，对应 gl.enable(gl.MULTISAMPLE)
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    // 第4步：轨道控制器 (OrbitControls)
    // 这不是 Three.js 核心，是官方示例库的扩展
    // 它封装了鼠标拖拽旋转/滚轮缩放，本质是持续修改 camera.position 和 camera.lookAt()
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 开启阻尼（惯性效果）

    // 第5步：创建立方体
    // 1. BoxGeometry(1, 1, 1) 生成了 24 个顶点（6个面 × 4个顶点）
    //    每个顶点包含: position (xyz), normal (法线), uv (纹理坐标)
    //    这些数据最终会通过 gl.bufferData() 上传到 GPU 显存
    // 2. MeshStandardMaterial() 生成了着色器程序
    //    它动态拼接了顶点着色器和片元着色器的 GLSL 代码
    //    包含了 PBR 光照计算（金属度/粗糙度模型）
    // 3. new THREE.Mesh(geometry, material) 把两者关联起来
    //    相当于绑定了 VBO 和 Shader Program
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4fc3f7, // 亮蓝色
      roughness: 0.3, // 粗糙度（0 = 镜面，1 = 完全粗糙）
      metalness: 0.8, // 金属感（0 = 非金属，1 = 纯金属）
      emissive: new THREE.Color('#0a0a2a'), // 微弱的自发光
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    // 第6步：添加光源
    // 【光源本质上就是着色器中的 uniform 变量
    // 方向光的位置会作为 uniform 传入片元着色器，参与光照计算
    // 如果没有光源，MeshStandardMaterial 会显示为全黑（因为没有光来计算反射）

    // 环境光: 提供基础照明，没有方向，所有面都能被照亮
    // 对应片元着色器中的 ambient 项
    const ambientLight = new THREE.AmbientLight('#404060');
    scene.add(ambientLight);

    // 方向光: 模拟太阳光，有方向性
    // 对应片元着色器中的 diffuse + specular 项
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(2, 3, 4);
    scene.add(directionalLight);

    // 背光：让暗部不至于全黑
    const backLight = new THREE.DirectionalLight('#4fc3f7', 0.5);
    backLight.position.set(-2, -1, -3);
    scene.add(backLight);

    // 辅助网格地面：帮助理解空间位置
    const gridHelper = new THREE.GridHelper(5, 20, '#888888', '#444444');
    scene.add(gridHelper);

    // 坐标轴辅助： (红X, 绿Y, 蓝Z)
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // 第7步：动画循环
    function animate() {
      requestAnimationFrame(animate);
      // 让立方体绕 Y 轴和 X 轴旋转
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.01;
      // 更新控制器 (如果开启了 damping)
      controls.update();
      // 渲染
      // 1. 更新所有物体的 World Matrix (如果 dirty)
      // 2. 更新相机的 View Matrix 和 Projection Matrix
      // 3. 执行视锥体裁剪 (Frustum Culling)，剔除视野外的物体
      // 4. 按透明度排序 (如果启用了透明)
      // 5. 对每个物体: 绑定 VBO → 设置 attribute → 上传 uniform → gl.drawElements()
      renderer.render(scene, camera);
    }

    animate();

    // 第8步：响应窗口大小变化
    window.addEventListener('resize', () => {
      // 更新相机的宽高比
      camera.aspect = window.innerWidth / window.innerHeight;
      // 重新计算投影矩阵
      camera.updateProjectionMatrix();
      // 更新渲染器尺寸
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/27-three.js.html)

**核心 API**：

* `new THREE.Scene()`：创建场景。
* `new THREE.PerspectiveCamera(FOV, AspectRatio, Near, Far)`：创建透视相机。
* `new THREE.WebGLRenderer()`：创建渲染器。
* `new OrbitControls()`：轨道控制器。**将在屏幕上的拖拽、滚动等手势，实时翻译成 Three.js 中 `camera`（摄像机）位置和朝向的改变。**旋转（Orbit）—左键拖拽 / 单指滑动、缩放（Zoom/Dolly）—滚轮滚动 / 双指捏合、平移（Pan）—右键拖拽 / 三指滑动 或 <kbd>Ctrl</kbd>+左键拖拽。
* `new THREE.BoxGeometry()`：创建立方体。
* `new THREE.MeshStandardMaterial()`：生成着色器程序。
* `new THREE.Mesh(geometry, material)`：将立方体和着色器程序关联起来。
* `new THREE.AmbientLight()`：创建环境光。
* `new THREE.DirectionalLight()`：创建方向光。
* `new THREE.GridHelper()`：创建辅助网格。
* `new THREE.AxesHelper()`：创建坐标轴辅助。

其中，**场景、相机、渲染器、几何体、材质**，这5个要素是构建 Three.js 应用的最小完整闭环：

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: '#00dddd',
});
const cube = new THREE.Mesh(geometry, material);

scene.background = new THREE.Color('#1a1a2e');
camera.position.z = 3;
cube.rotateZ(Math.PI / 4);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

cube.position.set(0, 0, 0);
cube.rotateX(Math.PI / 4);
scene.add(cube);

renderer.render(scene, camera);
```

### 场景（Scene）

场景（Scene） 是所有物体的容器，也是构建 3D 世界的根基。三维场景对象理解为虚拟的 3D 场景，用来表示模拟生活中的真实三维场景，或者说三维世界。

从底层来看，**`Scene` 是一个继承自 `Object3D` 的特殊容器**。它除了拥有 `Object3D` 的所有变换属性（`position`、`rotation`、`scale`）外，还专门用来管理渲染所需的环境。

在 WebGL 底层，Scene 实际上管理着两套数据：

- **场景图（Scene Graph）**：一个树形结构，存储所有要绘制的物体及其父子关系。
- **渲染状态（Render State）**：如背景色、雾效等全局渲染参数。

#### 构造函数

创建一个新的场景对象。创建后，它是一个空的容器。

```javascript
const scene = new THREE.Scene();
```

#### 核心属性

* `background`：设置场景的背景颜色或纹理。其值可以是 `Color`、`Texture` 或 `CubeTexture`。
* `fog`：为场景添加雾效，让远处的物体逐渐淡出视野。其值可以是 `Fog`（线性雾）或 `FogExp2`（指数雾）。
* `overrideMaterial`：强制场景中所有物体使用同一个材质。这是一个**调试利器**。

#### 核心方法

* `add(object)`：向场景中添加一个对象（可以是 `Mesh`、`Light`、`Group`、`Camera` 等）。
* `remove(object)`：从场景中移除一个对象。
* `getObjectById(id)`：通过对象的唯一 ID 查找对象（这个 ID 是 Three.js 自动生成的，不可变）。
* `scene.getObjectByName(name)`：通过对象的 name 属性查找对象（name 需要你自己设置）。
* `scene.traverse(callback)`：遍历场景图的所有子孙节点，对每个节点执行回调函数。

### 相机（Camera）

相机决定了从什么位置、什么角度、以什么样的视野来观察 3D 世界。

从底层来看，**相机（Camera）本质上是一个包含了**视图矩阵（View Matrix）**和**投影矩阵（Projection Matrix）**的计算器**。

- **视图矩阵**：定义了“眼睛”在 3D 世界中的位置和朝向。它决定了哪些物体在视野内，以及它们之间的相对位置关系。
- **投影矩阵**：定义了“眼睛”的镜头参数。它决定了物体如何被“投射”到 2D 屏幕上，包括透视效果、视野范围等。

在 Three.js 中，`Camera` 是一个基类，主要会用到它的两个子类：**透视相机（PerspectiveCamera）** 和 **正交相机（OrthographicCamera）**。

#### 透视相机

透视相机（PerspectiveCamera）模拟了人眼观察世界的方式，具有“近大远小”的透视效果。

**构造函数**：

```javascript
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
```

* `fov`：垂直视野角（Field of View），单位是度。决定能看到多宽的范围。值越大，视野越广，物体显得越小（鱼眼效果）；值越小，视野越窄，物体显得越大（长焦效果）。常用范围 40 ~ 90。
* `aspect`：宽高比（Aspect Ratio），通常是画布的 宽度 / 高度。如果设置不正确，画面中的物体会被拉伸变形。一般设置为 window.innerWidth / window.innerHeight。
* `near`：近裁剪面，距离相机多近的物体开始被渲染。必须大于 0。设置得太小（如 0.0001）会导致深度冲突（Z-fighting），使物体表面闪烁。通常设为 0.1 或 1。
* `far`：远裁剪面，距离相机多远的物体不再被渲染。必须大于 near。设置得太大（如 10000）会降低深度缓冲区的精度，也可能导致 Z-fighting。通常设为刚好能包含所有物体的值。

```javascript
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.lookAt(0, 0, 0); // 看向世界原点

camera.position.set(2, 3, 5); // 将相机放在 (2,3,5) 位置

// 获取相机的世界方向（它看向哪里）
const direction = new THREE.Vector3();
camera.getWorldDirection(direction);
```

#### 正交相机

正交相机（OrthographicCamera）没有透视效果，物体的大小和距离无关。它通常用于 2D 游戏、UI 界面、工程图或需要精确尺寸对比的场景。

**构造函数**：

```javascript
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
```

* `left`：视景体的左平面在 X 轴上的位置。
* `right`：视景体的右平面在 X 轴上的位置。
* `top`：视景体的上平面在 Y 轴上的位置。
* `bottom`：视景体的下平面在 Y 轴上的位置。
* `near`：近裁剪面。
* `far`：远裁剪面。

这六个参数定义了一个长方体（视景体），只有在这个长方体内部的物体才会被看到。

```javascript
const frustumSize = 10;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2, // left
  frustumSize * aspect / 2,  // right
  frustumSize / 2,           // top
  -frustumSize / 2,          // bottom
  0.1,                       // near
  100                        // far
);
camera.position.set(0, 0, 10); // 放在 Z 轴上
camera.lookAt(0, 0, 0);
```

### 渲染器（Renderer）

渲染器是 Three.js 的**绘图引擎**，负责读取场景、相机、灯光、模型数据，通过显卡计算出像素画面，输出到网页 canvas 上。

从底层来看，**渲染器（Renderer）是一个封装了 WebGL 上下文（WebGL Context）和渲染管线的管理器**。

核心职责：

- **管理 WebGL 上下文**：创建并持有 `<canvas>` 元素和 WebGL 上下文对象。
- **配置渲染状态**：管理深度测试（Depth Test）、混合模式（Blending）、面剔除（Face Culling）等 WebGL 状态。
- **执行渲染命令**：在每一帧中，遍历场景图，为每个物体绑定顶点缓冲、设置着色器 uniform、执行 `gl.drawArrays()` 或 `gl.drawElements()`。
- **管理 GPU 资源**：管理纹理、几何体、着色器程序等在 GPU 显存中的生命周期。

#### WebGLRenderer

`WebGLRenderer` 是 Three.js 最核心、最常用的渲染器。

构造函数：

```javascript
const renderer = new THREE.WebGLRenderer(parameters);
```

`parameters` 是一个可选对象，用于配置渲染器的行为：

* `antialias`：默认值 false，是否开启抗锯齿（平滑边缘）。开启会消耗更多性能。
* `alpha`：默认值 false，是否开启透明通道。
* `powerPreference`：默认值 default，GPU 电源偏好。可选值：high-performance—高性能 GPU，low-power—低功耗。
* `depth`：默认值 true，是否启用深度缓冲区。
* `stencil`：默认值 false，是否启用模板缓冲区（用于高级特效，如阴影裁剪）。
* `precision`：默认值 highp，着色器精度。可选值：highp-高精度、mediump-中精度、lowp-低精度。
* `premultipliedAlpha`：默认值 true，是否使用预乘 Alpha（对透明纹理有影响）。
* `logarithmicDepthBuffer`：默认值 false，是否使用对数深度缓冲区（解决大场景下的 Z-fighting 问题）。

核心属性：

* `domElement`：返回 canvas元素，可以添加到 DOM 中。
* `width / height`：当前渲染器的宽高（像素）。
* `outputColorSpace`：默认 `THREE.SRGBColorSpace`（适合显示器），输出的颜色空间。
* `toneMapping`：色调映射算法。将 HDR 颜色映射到 LDR 显示器范围。可选值：`THREE.NoToneMapping`—默认、`THREE.ACESFilmicToneMapping`—电影级（推荐）、`THREE.ReinhardToneMapping`。
* `toneMappingExposure`：默认为 1。曝光度，调高让画面更亮。
* `info`：包含渲染统计信息的对象，非常实用。
* `xr`：WebXR 管理器，用于 VR/AR 开发。

核心方法：

* `setSize(width, height)`：设置渲染器的输出尺寸（像素）。同时会调整 canvas 元素的尺寸和 `gl.viewport()`。
* `setPixelRatio(ratio)`：设置设备像素比。通常设为 `Math.min(window.devicePixelRatio, 2)` 以限制性能开销。
* `render(scene, camera)`：核心方法。渲染一个场景到屏幕（或渲染目标）。内部会执行完整的渲染管线。
* `setAnimationLoop(callback)`：高级封装，代替手动的 `requestAnimationFrame` 循环。会自动处理渲染循环。
* `setClearColor(color, alpha)`：设置清空画布的颜色。
* `getClearColor()`：获取当前清空颜色。

* `clear()`：手动清空画布（颜色、深度、模板缓冲区）。

* `setScissor(x, y, width, height)`：设置裁剪区域。

* `setViewport(x, y, width, height)`：设置视口。

* `getContext()`：获取底层的 WebGL 上下文对象（gl）。

* `getPixelRatio()`：获取当前像素比。

* `compile(scene, camera)`：预编译场景中的着色器（减少首次渲染的卡顿）。

* `dispose()`：释放所有 GPU 资源（内存清理）。


```javascript
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setAnimationLoop(() => {
	renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
});
```

#### WebGPURenderer

WebGPURenderer 是 Three.js 面向未来的渲染器，基于最新的 **WebGPU** 标准构建。

**核心定位**：WebGL 的后继者，旨在提供更强大、更高效的图形和计算能力，以应对数字孪生、大规模粒子系统等复杂场景的性能挑战。

**主要优势**：

- **性能飞跃**：通过更底层的 GPU 控制，能显著降低渲染开销。有测试表明，在处理复杂场景时，其帧时间比 WebGL 降低 40% 以上。
- **计算着色器**：原生支持在 GPU 上进行通用计算（如物理模拟、图像处理），这是 WebGL 的短板。
- **更现代的架构**：支持异步资源加载、多队列调度等特性，能更好地利用现代 GPU。

**现状与使用**：Three.js 从 r180 版本开始正式推出 `WebGPURenderer`，但仍处于快速发展中。它已具备自动回退到 WebGL 的机制，以保证在尚未支持 WebGPU 的浏览器上的兼容性。

#### WebGL2Renderer

WebGL2Renderer 本质上是 WebGLRenderer 的强制版本**，专门用于创建使用 **WebGL 2.0 上下文的渲染器。

**核心价值**：WebGL 2.0 相比 1.0 引入了许多新特性（如更高级的纹理处理、3D 纹理支持等）。

现在标准的 `WebGLRenderer` 会自动检测浏览器能力，并优先使用 WebGL 2.0。因此，`WebGL2Renderer` 可以看作是强制启用 WebGL 2.0 的特殊版本，在大多数情况下你直接使用 `WebGLRenderer` 即可，无需特别关注此渲染器。

**注意**：`WebGLRenderer`、`WebGL2Renderer` 和 `WebGPURenderer` 的核心**用法、属性和方法高度相似**。它们都遵循 Three.js 为渲染器制定的统一接口规范。

#### CSS2DRenderer

CSS2DRenderer 用于**在 3D 场景的精确位置，叠加渲染 2D 的 HTML 元素**，并且这些元素始终面向屏幕。它非常适合用来做信息标签、数据面板、工具提示等。

**核心特点**：它渲染的是标准的 HTML 元素（`div`、`span` 等），文本清晰，样式丰富，且易于添加交互事件（如鼠标悬停效果）。

在项目中，通常会同时使用 `WebGLRenderer` 渲染 3D 模型，再用 `CSS2DRenderer` 叠加一层来渲染所有的 2D 标签，两者配合工作。

```javascript
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建 CSS2D 渲染器（负责 HTML 标签）
const css2DRenderer = new THREE.CSS2DRenderer();
css2DRenderer.setSize(window.innerWidth, window.innerHeight);
css2DRenderer.domElement.style.position = 'absolute';
css2DRenderer.domElement.style.top = '0px';
css2DRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(css2DRenderer.domElement);

// 创建一个 HTML 标签
const div = document.createElement('div');
div.textContent = 'Hello 3D!';
div.style.color = 'white';
div.style.fontSize = '20px';
div.style.background = 'rgba(0,0,0,0.7)';
div.style.padding = '8px 16px';
div.style.borderRadius = '4px';

// 将 HTML 元素包装成 Three.js 对象
const label = new CSS2DObject(div);
label.position.set(0, 1, 0);
scene.add(label);

// renderer 处理普通的 3D 物体
renderer.render(scene, camera);
// css2DRenderer 处理 CSS2DObject 类型的对象
css2DRenderer.render(scene, camera);
```

#### CSS3DRenderer

CSS3DRenderer 是将 HTML 元素**真正地放置在 3D 空间中进行变换**。这意味着它渲染的标签会跟随场景的透视关系，产生近大远小、旋转、倾斜等 3D 效果。

**核心特点**：利用了 CSS 的 `transform3D` 特性，因此元素可以像 3D 物体一样在空间中进行旋转和摆放。不过，它不支持光照和阴影等传统 3D 渲染效果。

适合创建 3D 卡片墙、可交互的 3D 菜单或布局，这些场景需要整个 HTML 元素作为一个整体在 3D 空间中运动。

**注意**：**`CSS3DRenderer` 和 `CSS2DRenderer` 的用法几乎完全一样**。它们遵循相同的设计模式。

### 几何体（Geometry）

几何体定义了物体的形状，是 3D 世界的骨架。

从底层来看，**几何体（Geometry）本质上是一个**顶点数据容器，它封装了所有与形状相关的 GPU 缓冲数据。

#### BufferGeometry

在 Three.js 中，`BufferGeometry` 是所有几何体的基类。它用一个**缓冲（Buffer）**系统来存储顶点属性（Attributes），比如位置、法线、UV 坐标等。

```javascript
const geometry = new THREE.BufferGeometry();
```

实例主要包含：

* `attributes`：属性是几何体的核心，主要属性包括：`position`-顶点位置 (x, y, z)、`normal`-顶点法线 (nx, ny, nz)、`uv`-纹理坐标 (u, v)。
* `index`：索引允你复用顶点，减少内存占用。
* `groups`：当几何体有多个材质时，使用 `groups` 来定义哪些三角形使用哪个材质。

核心 API 速查表：

* `attributes`：所有顶点属性的字典。
* `attributes.position`：位置属性。
* `attributes.normal`：法线属性。
* `attributes.uv`：UV 坐标属性。
* `index`：索引缓冲区。
* `groups`：绘制组（多材质支持）。
* `setAttribute(name, attr)`：设置顶点属性。
* `setIndex(indices)`：设置索引缓冲区。
* `computeVertexNormals()`：自动计算顶点法线。
* `toNonIndexed()`：将索引几何体转换为非索引几何体。
* `deleteAttribute(name)`：删除属性。
* `translate(x, y, z)`：平移几何体。
* `rotateX(rad)`：绕 X 轴旋转几何体。
* `scale(x, y, z)`：缩放几何体。
* `center()`：居中几何体。

#### 内置几何体

Three.js 提供了大量内置几何体，覆盖了大部分常见形状：

* `BoxGeometry`：长方体/立方体。
* `SphereGeometry(radius, widthSegments, heightSegments)`：球体。
* `PlaneGeometry(width, height)`：平面。
* `CylinderGeometry(radiusTop, radiusBottom, height)`：圆柱/圆锥/圆台。
* `TorusGeometry(radius, tube, radialSegments, tubularSegments)`：甜甜圈/圆环。
* `RingGeometry(innerRadius, outerRadius)`：圆环面/2D环。
* `ConeGeometry(radius, height, radialSegments)`：圆锥体。
* `TorusKnotGeometry(radius, tube, tubularSegments, radialSegments)`：环面结（复杂形状）。

```javascript
new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q)
```

```javascript
const box = new THREE.BoxGeometry(2, 1, 0.5);
const smoothBox = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);

const sphere = new THREE.SphereGeometry(1, 48, 32);
const lowPolySphere = new THREE.SphereGeometry(1, 8, 6);
const halfSphere = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);

const plane = new THREE.PlaneGeometry(5, 3, 10, 10);

const cylinder = new THREE.CylinderGeometry(1, 1, 2, 32);
const cone = new THREE.CylinderGeometry(0, 1, 2, 32);
const hexPrism = new THREE.CylinderGeometry(1, 1, 2, 6);
const tube = new THREE.CylinderGeometry(1, 1, 3, 32, 1, true);

const torus = new THREE.TorusGeometry(1, 0.4, 16, 64);
const thickDonut = new THREE.TorusGeometry(1, 0.8, 16, 48);
const halfTorus = new THREE.TorusGeometry(1, 0.3, 12, 32, Math.PI);

const ring = new THREE.RingGeometry(0.5, 1, 48);
const halfRing = new THREE.RingGeometry(0.5, 1, 32, 1, 0, Math.PI);

const cone = new THREE.ConeGeometry(1, 2, 32);

const knot = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 2, 3);
const complexKnot = new THREE.TorusKnotGeometry(1, 0.3, 128, 16, 5, 3);
```

### 材质（Material）

材质定义了物体表面的视觉外观——它是什么颜色、是否粗糙、像金属还是塑料、是否发光等等。

从底层来看，**材质（Material）本质上是一个**着色器程序（Shader Program）的配置对象。

当创建一个材质时，Three.js 会在背后：

- 根据材质类型，动态生成对应的**顶点着色器（Vertex Shader）**和**片元着色器（Fragment Shader）**的 GLSL 代码。
- 将着色器代码编译、链接成一个完整的着色器程序。
- 将设置的属性（颜色、粗糙度等）映射为着色器中的 **uniform 变量**。

#### 材质分类

Three.js 的材质可以分为三大类：

* 基础材质：MeshBasicMaterial，不受光照影响，直接显示颜色/纹理。
* 光照材质：MeshLambertMaterial、MeshPhongMaterial、MeshStandardMaterial、MeshPhysicalMaterial，受光照影响，从简单到复杂。
* 特殊材质：ShaderMaterial、RawShaderMaterial、SpriteMaterial、LineBasicMaterial、PointsMaterial，自定义着色器、粒子、线条等。

**材质详解**：

* MeshBasicMaterial（基础材质）：最简单的材质，不响应光照，直接显示颜色或纹理。
*  MeshLambertMaterial（兰伯特材质）：基于兰伯特光照模型的材质，只计算漫反射（Diffuse），不计算镜面高光（Specular）。
* MeshPhongMaterial（冯材质）：基于冯氏光照模型，增加了镜面高光（Specular）计算。
* MeshStandardMaterial（标准材质）（最常用）：**基于 PBR（基于物理的渲染）** 的材质，使用金属度和粗糙度来定义表面属性。
* MeshPhysicalMaterial（物理材质）（最高级）：在**标准材质**上增加更多真实效果，如：**清漆（Clearcoat）**、**透明度**、**光泽**、**折射**等。
* ShaderMaterial（着色器材质）（自定义）：最灵活、最底层的材质，允许直接编写 GLSL 着色器代码。

#### 材质示例

```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Three.js</title>
  <style>
    body { margin: 0; overflow: hidden; }
  </style>
</head>
<body>
  <script type="importmap">
    {
      "imports": {
        "three": "./three.module.js",
        "OrbitControls": "./OrbitControls.js"
      }
    }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'OrbitControls';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 光源
    const ambient = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 4, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x4fc3f7, 0.5, 10);
    pointLight.position.set(-2, 1, 2);
    scene.add(pointLight);

    const materialConfigs = [
      {
        name: 'Basic',
        create: () => new THREE.MeshBasicMaterial({ 
          color: 0x4fc3f7, 
          wireframe: false 
        }),
      },
      {
        name: 'Lambert',
        create: () => new THREE.MeshLambertMaterial({ 
          color: 0x4fc3f7 
        }),
      },
      {
        name: 'Phong',
        create: () => new THREE.MeshPhongMaterial({ 
          color: 0x4fc3f7, 
          specular: 0xffffff, 
          shininess: 60 
        }),
      },
      {
        name: 'Standard',
        create: () => new THREE.MeshStandardMaterial({ 
          color: 0x4fc3f7, 
          roughness: 0.3, 
          metalness: 0.7 
        }),
      },
      {
        name: 'Physical',
        create: () => new THREE.MeshPhysicalMaterial({ 
          color: 0x4fc3f7, 
          roughness: 0.2, 
          metalness: 0.9,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
        }),
      },
    ];

    const sphereRadius = 0.6;
    const spacing = 1.8;
    const startX = -(materialConfigs.length - 1) * spacing / 2;

    materialConfigs.forEach((config, index) => {
      const x = startX + index * spacing;

      // 球体
      const geometry = new THREE.SphereGeometry(sphereRadius, 32, 24);
      const material = config.create();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0.2, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // 地面小方块
      const floorGeo = new THREE.BoxGeometry(0.4, 0.05, 0.4);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x666688, roughness: 0.8 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.set(x, -0.3, 0);
      floor.receiveShadow = true;
      scene.add(floor);
    });

    // 地面
    const groundGeo = new THREE.PlaneGeometry(12, 4);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x222244, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.35, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.GridHelper(12, 20, 0x888899, 0x444466));

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

### 纹理（Texture）

纹理是让材质从“纯色”变成“真实世界”的关键，它把一张图片（或数据）映射到 3D 物体的表面，赋予它丰富的细节。

从底层来看，**纹理（Texture）本质上是一个**上传到 GPU 显存的图像数据**，它通过**纹理坐标（UV 坐标）映射到 3D 模型的表面。

在 WebGL 中，使用纹理的完整流程是：

- 创建纹理对象：`gl.createTexture()`。
- 绑定纹理单元：`gl.bindTexture(gl.TEXTURE_2D, texture)`。
- 上传图像数据：`gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)`。
- 设置纹理参数：`gl.texParameteri()`（过滤、包裹方式等）。
- 在着色器中采样：`texture2D(uTexture, vUv)`。

**UV 坐标（纹理坐标）**是纹理映射的基础，它定义了**纹理图像上的点**与**3D 模型顶点**之间的对应关系：

- **U**：水平方向（0~1），从左到右。
- **V**：垂直方向（0~1），从下到上。

```javascript
const uvAttribute = geometry.attributes.uv;
console.log('UV 坐标:', uvAttribute.array);
```

**加载纹理方式**：

* TextureLoader：常规图片（JPG/PNG），最常用，异步加载。
* CubeTextureLoader：6 张图片组成环境贴图，用于天空盒、环境反射。
* DataTexture：程序生成的数据，在 CPU 上生成像素数据。
* CanvasTexture：HTML Canvas 元素，动态生成纹理。
* VideoTexture：HTML Video 元素，视频作为纹理。
* CompressedTexture：DDS/KTX 压缩格式，减少显存占用。

#### texture（纹理）

`TextureLoader` 是加载纹理的标准方式，它返回一个 `Texture` 对象。

```javascript
import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

// 方式一：同步加载（会阻塞，不推荐）
const texture = textureLoader.load('path/to/image.jpg');

// 方式二：异步加载（推荐）
textureLoader.load('path/to/image.jpg',
  (texture) => {
    console.log('纹理加载成功', texture);
    material.map = texture;
    material.needsUpdate = true;
  },
  (xhr) => {
    console.log(`加载进度: ${(xhr.loaded / xhr.total * 100)}%`);
  },
  (err) => {
    console.error('加载失败', err);
  }
);

// 方式三：使用 Promise（方便配合 async/await）
function loadTexture(url) {
  return new Promise((resolve, reject) => {
    textureLoader.load(url, resolve, undefined, reject);
  });
}
const texture = await loadTexture('path/to/image.jpg');
```

创建纹理后，可以通过参数控制：

```javascript
const texture = textureLoader.load('path/to/image.jpg');

texture.wrapS = THREE.RepeatWrapping;   // U 方向包裹方式
texture.wrapT = THREE.RepeatWrapping;   // V 方向包裹方式
texture.repeat.set(2, 2);               // 重复次数
texture.offset.set(0.5, 0.5);           // 偏移量
texture.rotation = Math.PI / 4;         // 旋转角度
texture.center.set(0.5, 0.5);           // 旋转中心

// 过滤方式（影响缩放时的清晰度）
texture.minFilter = THREE.LinearMipmapLinearFilter; // 缩小过滤
texture.magFilter = THREE.LinearFilter;            // 放大过滤

// 各向异性过滤（改善倾斜视角的清晰度）
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
```

#### CubeTexture（立方体纹理 / 环境贴图）

由 6 张图片组成一个立方体，用于天空盒和环境反射。

```javascript
import { CubeTextureLoader } from 'three';

const cubeTextureLoader = new CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  'px.jpg', // +X (右)
  'nx.jpg', // -X (左)
  'py.jpg', // +Y (上)
  'ny.jpg', // -Y (下)
  'pz.jpg', // +Z (前)
  'nz.jpg', // -Z (后)
]);

scene.background = envMap;
material.envMap = envMap;
material.envMapIntensity = 1.2;
```

#### DataTexture（数据纹理）

在 CPU 上生成纹理数据，适合程序化纹理。

```javascript
import { DataTexture } from 'three';

const width = 256;
const height = 256;
const data = new Uint8Array(width * height * 4);

for (let i = 0; i < data.length; i += 4) {
  const x = (i / 4) % width;
  const y = Math.floor((i / 4) / width);
  data[i] = (x / width) * 255;     // R
  data[i + 1] = (y / height) * 255; // G
  data[i + 2] = 128;                // B
  data[i + 3] = 255;                // A
}

const texture = new THREE.DataTexture(data, width, height);
texture.needsUpdate = true;
```

#### VideoTexture（视频纹理）

将视频作为纹理播放。

```javascript
import { VideoTexture } from 'three';

const video = document.createElement('video');
video.src = 'path/to/video.mp4';
video.loop = true;
video.autoplay = true;
video.muted = true;
video.play();

const texture = new VideoTexture(video);
const material = new THREE.MeshBasicMaterial({ map: texture });
```

#### 纹理类型

* 颜色贴图（Map）：定义物体的基础颜色，是最基本的纹理。
* 粗糙度贴图（Roughness Map）：控制表面的粗糙程度，白色 = 粗糙，黑色 = 光滑。
* 金属度贴图（Metalness Map）：控制表面的金属程度，白色 = 金属，黑色 = 非金属。
* 法线贴图（Normal Map）：通过 RGB 编码法线方向，产生凹凸感但不改变几何体形状。
* 环境光遮蔽贴图（AO Map）：模拟物体间的阴影遮蔽，增加真实感。注意：AO 贴图需要几何体有第二组 UV（uv2）。
* 置换贴图（Displacement Map）：实际改变几何体顶点的位置，产生真实的凹凸效果。需要几何体有足够的分段数。

```javascript
// 颜色贴图（Map）
const material = new THREE.MeshStandardMaterial({
	map: textureLoader.load('path/to/diffuse.jpg'),
});

// 粗糙度贴图（Roughness Map）
const material = new THREE.MeshStandardMaterial({
  roughnessMap: textureLoader.load('path/to/roughness.jpg'),
  roughness: 1, // 贴图会乘以此值
});

// 金属度贴图（Metalness Map）
const material = new THREE.MeshStandardMaterial({
  metalnessMap: textureLoader.load('path/to/metalness.jpg'),
  metalness: 1,
});

// 法线贴图（Normal Map）
const material = new THREE.MeshStandardMaterial({
  normalMap: textureLoader.load('path/to/normal.jpg'),
  normalScale: new THREE.Vector2(0.5, 0.5), // 强度控制
});

// 环境光遮蔽贴图（AO Map）
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  aoMap: textureLoader.load('path/to/ao.jpg'),
  aoMapIntensity: 1,
});

// 置换贴图（Displacement Map）
const geometry = new THREE.PlaneGeometry(2, 2, 128, 128);
const material = new THREE.MeshStandardMaterial({
  displacementMap: textureLoader.load('path/to/displacement.jpg'),
  displacementScale: 0.5,
  displacementBias: -0.25,
});
```

#### 纹理示例

```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Three.js</title>
  <style>
    body { margin: 0; overflow: hidden; }
  </style>
</head>
<body>
  <script type="importmap">
    {
      "imports": {
        "three": "./three.module.js",
        "OrbitControls": "./OrbitControls.js"
      }
    }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'OrbitControls';

    // 场景、相机、渲染器
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 光源
    const ambient = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // 纹理加载
    // 使用在线纹理（Three.js 官方示例图片）
    const textureLoader = new THREE.TextureLoader();
    const textureUrl = 'https://threejs.org/examples/textures/uv_grid_opengl.jpg';
    const colorTexture = textureLoader.load(textureUrl);
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.repeat.set(2, 2);

    // 创建带纹理的材质
    const material = new THREE.MeshStandardMaterial({
      map: colorTexture,
      roughness: 0.4,
      metalness: 0.6,
    });

    // 球体
    const geometry = new THREE.SphereGeometry(0.3, 64, 48);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0.4, 0);
    mesh.castShadow = true;
    scene.add(mesh);

    // 地面
    const groundGeo = new THREE.PlaneGeometry(4, 4);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x333355,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.5, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.GridHelper(4, 10, 0x888899, 0x444466));

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 显示纹理参数控制面板（控制台）
    console.log('💡 纹理参数调整示例:');
    console.log('  texture.wrapS = THREE.RepeatWrapping');
    console.log('  texture.repeat.set(2, 2)');
    console.log('  texture.rotation = Math.PI / 4');
    console.log('  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()');
  </script>
</body>
</html>
```

### 光源

光源是 3D 场景中营造氛围、塑造立体感和真实感的关键。没有光，标准材质（如 `MeshStandardMaterial`）渲染出来就是全黑的。

从底层来看，**光源（Light）本质上是一组传递给着色器的** uniform 变量，包括位置、方向、颜色、强度、衰减系数等。在片元着色器中，这些 uniform 参与光照计算（如 Blinn-Phong 或 PBR 模型），最终决定每个像素的颜色值。

#### 光源类型

Three.js 提供了多种光源，每种都有不同的物理特性：

* **AmbientLight（环境光）**：**均匀照亮**场景中的所有物体，没有方向，没有位置。它提供的是基础照明，防止物体完全陷入黑暗。
* **DirectionalLight（平行光）**：模拟**无限远处的光源**，光线相互平行，如太阳光。它只关心方向，不关心位置。
* **PointLight（点光源）**：从**一点向所有方向**发射光线，类似于灯泡或烛光。光线强度随距离衰减。
* **SpotLight（聚光灯）**：从一点发出**锥形光束**，模拟舞台聚光灯或手电筒效果。它有方向、角度和衰减。。
* **RectAreaLight（矩形面光源）**：从一个**矩形平面**均匀发射光线，产生非常柔和、自然的阴影，模拟窗户光、柔光箱等。
* **HemisphereLight（半球光）**：模拟**天空和地面**的环境光照，光线从上方和下方分别发出不同的颜色。

```javascript
// AmbientLight（环境光）
const ambientLight = new THREE.AmbientLight(
  0x404060, // 颜色
  0.5       // 强度（默认 1）
);

// DirectionalLight（平行光）
const dirLight = new THREE.DirectionalLight(
  0xffffff, // 颜色
  1.5       // 强度（默认 1）
);
dirLight.position.set(2, 5, 3);

// PointLight（点光源）
const pointLight = new THREE.PointLight(
  0xffaa00, // 颜色
  1,        // 强度（默认 1）
  10,       // 距离（衰减到零的距离，0 = 无限）
  2         // 衰减指数（默认 2）
);
pointLight.position.set(1, 2, 1);

// SpotLight（聚光灯）
const spotLight = new THREE.SpotLight(
  0xffffff, // 颜色
  2,        // 强度（默认 1）
  10,       // 距离
  Math.PI / 4, // 光束角度（弧度，默认 π/3）
  0.3,      // 半影（边缘柔和度，0~1）
  1         // 衰减指数（默认 2）
);
spotLight.position.set(0, 5, 2);
spotLight.target.position.set(0, 0, 0);

// RectAreaLight（矩形面光源）
const rectLight = new RectAreaLight(
  0x4fc3f7, // 颜色
  2,        // 强度
  3,        // 宽度
  2         // 高度
);
rectLight.position.set(2, 3, 2);
rectLight.lookAt(0, 0, 0);

// HemisphereLight（半球光）
const hemiLight = new THREE.HemisphereLight(
  0x87ceeb, // 天空颜色（上方）
  0x3a1c0a, // 地面颜色（下方）
  0.8       // 强度
);
```

#### 阴影

阴影是光源的重要功能，能极大增强场景的真实感。

```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;

mesh.castShadow = true;   // 投射阴影
mesh.receiveShadow = true; // 接收阴影
```

光源的阴影实际上是从光源视角渲染场景的深度图，阴影相机控制这个深度图的视景体：

```javascript
// DirectionalLight 的阴影相机（正交）
dirLight.shadow.camera.left = -5;
dirLight.shadow.camera.right = 5;
dirLight.shadow.camera.top = 5;
dirLight.shadow.camera.bottom = -5;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 20;
dirLight.shadow.mapSize.width = 1024; // 阴影贴图分辨率
dirLight.shadow.mapSize.height = 1024;

// 可视化阴影相机
const helper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(helper);
```

#### 光源示例

```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>光源对比</title>
  <style> body { margin: 0; overflow: hidden; } </style>
</head>
<body>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }
    }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    // 创建一个测试物体
    const geometry = new THREE.SphereGeometry(0.8, 48, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4fc3f7,
      roughness: 0.3,
      metalness: 0.6,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0.4, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    // 地面
    const groundGeo = new THREE.PlaneGeometry(6, 6);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x333355,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.5, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    // 网格辅助
    scene.add(new THREE.GridHelper(6, 12, 0x888899, 0x444466));

    // 添加光源（逐一尝试）

    // 环境光 - 提供基础照明
    const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
    scene.add(ambientLight);

    // 平行光 - 主光
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 4, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);
    scene.add(new THREE.DirectionalLightHelper(dirLight, 0.5));

    // 点光源 - 辅助光
    const pointLight = new THREE.PointLight(0xff6b6b, 0.8, 6);
    pointLight.position.set(-1.5, 1.5, 1);
    scene.add(pointLight);
    scene.add(new THREE.PointLightHelper(pointLight, 0.3));

    // 聚光灯 - 背光
    const spotLight = new THREE.SpotLight(0x4fc3f7, 0.5, 8, Math.PI / 6, 0.3);
    spotLight.position.set(0, 3, -2);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);
    scene.add(new THREE.SpotLightHelper(spotLight));

    // 半球光 - 环境补充
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3a1c0a, 0.2);
    scene.add(hemiLight);

    // 矩形面光源（注释掉，因为需要额外导入）
    const rectLight = new THREE.RectAreaLight(0xffaa00, 1, 2, 1.5);
    rectLight.position.set(2, 2, 2);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);
    scene.add(new RectAreaLightHelper(rectLight));

    renderer.setAnimationLoop(() => {
      // 让点光源缓慢移动
      const time = Date.now() * 0.001;
      pointLight.position.x = -1.5 + Math.sin(time * 0.5) * 1;
      pointLight.position.z = 1 + Math.cos(time * 0.5) * 1;

      controls.update();
      renderer.render(scene, camera);
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

### 动画

动画是让 3D 场景“活”起来的关键，它让物体能够移动、旋转、缩放、变形，甚至让角色做出复杂的动作。

从底层来看，**动画本质上是在每一帧中更新物体的变换属性（position、rotation、scale）或顶点数据**，然后重新渲染。

#### 手动更新（最基础）

直接在动画循环中修改物体的属性，是最简单、最直接的动画方式。

```javascript
function animate() {
  requestAnimationFrame(animate);

  // 旋转
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  // 平移（沿椭圆轨迹运动）
  const time = Date.now() * 0.001;
  mesh.position.x = Math.sin(time) * 2;
  mesh.position.z = Math.cos(time) * 2;

  // 缩放（呼吸效果）
  mesh.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

  renderer.render(scene, camera);
}
animate();
```

#### AnimationMixer（关键帧动画）

`AnimationMixer` 是 Three.js 提供的**关键帧动画系统**，类似于 3D 软件（如 Blender、Maya）中的动画编辑器。

**核心概念**：

* `KeyframeTrack`：关键帧轨道，定义某个属性在不同时间点的值。
* `AnimationClip`：动画片段，包含多个轨道，一个完整的动画。
* `AnimationMixer`：动画混合器，负责播放、混合多个动画片段。
* `AnimationAction`：动画动作，控制某个动画片段的播放状态。

```javascript
import { AnimationMixer, AnimationClip, KeyframeTrack } from 'three';

// 创建关键帧轨道
const positionTrack = new KeyframeTrack(
  '.position', // 属性路径
  [0, 1, 2],   // 时间点（秒）
  [0, 0, 0,    // 时间点 0 的位置 (x, y, z)
   2, 0, 0,    // 时间点 1 的位置
   0, 0, 0]    // 时间点 2 的位置
);

// 创建动画片段
const clip = new AnimationClip(
  'myAnimation',  // 名称
  2,              // 持续时间（秒）
  [positionTrack] // 轨道数组
);

// 创建动画混合器：绑定目标对象 + 指定动画片段
const mixer = new AnimationMixer(mesh);
const action = mixer.clipAction(clip);
action.play();
action.loop = THREE.LoopRepeat;

// 在动画循环中更新混合器
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // 获取时间增量，即上一帧到这一帧的时间差
  mixer.update(delta); // 必须调用！驱动动画前进
  renderer.render(scene, camera);
}
animate()
```

#### AnimationAction（动画控制）

`AnimationAction` 提供了丰富的播放控制方法：

```javascript
const action = mixer.clipAction(clip);

// 播放控制
action.play();     // 播放
action.pause();    // 暂停
action.stop();     // 停止（重置到开始）
action.reset();    // 重置到开始

// 速度控制
action.timeScale = 0.5; // 半速播放
action.timeScale = 2;   // 双倍速度

// 循环控制
action.loop = THREE.LoopRepeat;      // 循环（默认）
action.loop = THREE.LoopOnce;        // 播放一次
action.loop = THREE.LoopPingPong;    // 往复循环

// 权重（用于混合多个动画）
action.weight = 0.5; // 权重 0~1

// 混合持续时间（过渡）
action.crossFadeTo(otherAction, 0.5); // 0.5 秒内过渡到另一个动作
```

#### 动画示例

```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Three.js 动画示例</title>
  <style> body { margin: 0; overflow: hidden; } </style>
</head>
<body>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }
    }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);

    // 创建多个物体进行动画 ---
    const clock = new THREE.Clock();

    // 旋转的立方体
    const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x4fc3f7, roughness: 0.3, metalness: 0.6 });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(-2, 0.4, 0);
    scene.add(cube);

    // 跳动的球体
    const sphereGeo = new THREE.SphereGeometry(0.5, 32, 24);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.2, metalness: 0.3 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(0, 0.5, 0);
    scene.add(sphere);

    // 环形结（带脉动缩放）
    const knotGeo = new THREE.TorusKnotGeometry(0.4, 0.15, 64, 16);
    const knotMat = new THREE.MeshStandardMaterial({ color: 0xffd93d, roughness: 0.3, metalness: 0.8 });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(2, 0.4, 0);
    scene.add(knot);

    const groundGeo = new THREE.PlaneGeometry(8, 4);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x222244, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.3, 0);
    scene.add(ground);

    scene.add(new THREE.GridHelper(8, 16, 0x888899, 0x444466));

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 立方体：旋转 + 浮动
      cube.rotation.x += delta * 0.8;
      cube.rotation.y += delta * 1.2;
      cube.position.y = 0.4 + Math.sin(elapsedTime * 1.5) * 0.2;

      // 球体：上下跳动 + 缩放 + 触地时压扁
      const jumpHeight = Math.abs(Math.sin(elapsedTime * 2));
      sphere.position.y = 0.2 + jumpHeight * 0.8;
      const squash = 1 - jumpHeight * 0.3;
      sphere.scale.x = 1 + (1 - squash) * 0.5;
      sphere.scale.z = 1 + (1 - squash) * 0.5;
      sphere.scale.y = squash;

      // 环形结：旋转 + 脉动
      knot.rotation.x += delta * 0.6;
      knot.rotation.y += delta * 0.9;
      const pulse = 1 + Math.sin(elapsedTime * 1.8) * 0.1;
      knot.scale.setScalar(pulse);

      controls.update();
      renderer.render(scene, camera);
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

### 粒子系统（Particles）

粒子系统是创造各种特效的利器，比如星空、烟雾、火焰、雨雪、魔法效果等。它通过控制大量独立的“点”或“小片”来实现复杂的视觉效果，而性能开销远小于同等数量的网格（Mesh）。

从底层来看，**粒子系统本质上是一组拥有位置、颜色、大小等属性的顶点数据**。它通过 `Points` 对象和 `PointsMaterial` 材质来渲染。

与网格（Mesh）不同，每个粒子通常是一个永远面向相机的正方形平面或一个点。不需要为每个粒子创建复杂的几何体，只需要管理好粒子的属性数据即可。

粒子系统三个核心部分：

- **`BufferGeometry`**：持有粒子的顶点数据。
- **`PointsMaterial`**：定义粒子的外观（大小、颜色、纹理、透明度等）。
- **`Points`**：将几何体和材质组合起来，形成一个可渲染的对象。

**PointsMaterial（粒子材质）**是专门为 `Points` 设计的材质，具有很多独特的属性：

| 属性              | 类型       | 默认值           | 说明                                                         |
| :---------------- | :--------- | :--------------- | :----------------------------------------------------------- |
| `size`            | `Number`   | `1`              | 粒子的大小。                                                 |
| `sizeAttenuation` | `Boolean`  | `true`           | 是否开启大小衰减（近大远小）。通常保持开启。                 |
| `map`             | `Texture`  | `null`           | 粒子的纹理贴图（通常是圆形渐变或方形图片）。                 |
| `color`           | `Color`    | `0xffffff`       | 粒子的颜色（如果设置了 `vertexColors`，则会忽略此属性）。    |
| `vertexColors`    | `Boolean`  | `false`          | 是否使用每个粒子的独立颜色。                                 |
| `opacity`         | `Number`   | `1`              | 透明度。                                                     |
| `transparent`     | `Boolean`  | `false`          | 是否开启透明（如果要使用 `opacity` 或透明纹理，必须设为 `true`）。 |
| `blending`        | `Blending` | `NormalBlending` | 混合模式。`AdditiveBlending`（叠加混合）常用于发光粒子。     |
| `depthWrite`      | `Boolean`  | `true`           | 是否写入深度缓冲区。设为 `false` 可以解决粒子重叠的闪烁问题。 |

```javascript
const particleCount = 10000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 5;
    positions[i] = (Math.random() - 0.5) * radius * 2;
    positions[i+1] = (Math.random() - 0.5) * radius * 2;
    positions[i+2] = (Math.random() - 0.5) * radius * 2;

    colors[i] = Math.random();
    colors[i+1] = Math.random();
    colors[i+2] = Math.random();
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// 3. 创建材质
const material = new THREE.PointsMaterial({
  size: 0.15,
  vertexColors: true,
  transparent: true,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
  depthWrite: false,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);
```

### 交互

交互是让用户从“观察者”变成“参与者”的关键，它让 3D 场景变得生动和可操作。

从底层来看，**3D 交互本质上是一个“点击检测”或“碰撞检测”的过程**。

当用户点击屏幕时，实际上是在一个 2D 平面上点击了一个点。3D 交互的核心任务就是：**将这个 2D 屏幕坐标，转换为 3D 世界空间中的一条射线，然后检测这条射线与场景中的 3D 物体是否相交。**

**Raycaster（射线投射器）**是 Three.js 提供的用于进行射线检测的核心类。

```javascript
const raycaster = new THREE.Raycaster();
const intersects = [];
function onPointerDown(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 从相机发射射线
  raycaster.setFromCamera(mouse, camera);

  // 对指定物体进行相交检测
  const intersects = raycaster.intersectObjects(scene.children);
  // 处理交互结果
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log('点击了:', clickedObject);
  }
}
```

### 加载外部三维模型

Three.js 加载外部模型主要通过**加载器（Loader）** 来实现，其中 `GLTFLoader` 是绝对的核心和首选方案。

`GLTF/GLB` 是 Three.js **官方推荐**的模型格式，具有文件小、加载快、支持完整的 3D 场景信息（包括材质、动画、骨骼等）等优点。

**加载流程**：

- **引入加载器**：在代码中导入 `GLTFLoader`。
- **创建加载器实例**：`new THREE.GLTFLoader()`。
- **执行加载**：调用 `loader.load()` 方法，传入模型路径和回调函数。
- **添加到场景**：在加载完成的回调里，将模型 (`gltf.scene`) 添加到你的 Three.js 场景中。

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('path/to/your/model.glb', 
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // 播放动画
    const mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  (xhr) => { console.log(`加载进度: ${(xhr.loaded / xhr.total) * 100}%`); },
  (error) => { console.error('模型加载失败:', error); }
);
```

### 结语

**在真实开发中，复杂动画的关键数据（特别是位置、旋转等关键帧值）几乎不会手动一行行写，而是借助工具来生成和导出的。** 

真实的 Three.js 项目中，往往使用：

- **核心角色动画、复杂运动** → **Blender 制作并导出 GLTF**。
- **环境特效、UI 动效、数据驱动反馈** → **在 `animate` 循环中编写数学公式**。
- **快速调整模型位置、预览光照** → **使用 Three.js Editor 或 Spline**，然后导出为 GLTF 或复制代码。

### 参考资料

[three.js](https://threejs.org/)

[Three.js中文网](https://www.webgl3d.cn/)

[three.js API 文档](https://www.webgl3d.cn/threejs/docs/index.html)