## jquery.model

实现手机框架（功能要求），尽量用css3的translate3d来控制页面切换效果，js只是来控制点击（focus）对dom的样式操作（addClass、removeClass、toggleClass）

### 界面结构

<table>
  <tr>
    <th>状态</th>
    <th>打开样式</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>status</td>
    <td>在body下open-status</td>
    <td>修复ios下全屏显示顶部对齐问题</td>
  </tr>
  <tr>
    <td>left</td>
    <td>在body下open-left</td>
    <td>打开左边菜单</td>
  </tr>
  <tr>
    <td>right</td>
    <td>在body下open-right</td>
    <td>打开右边菜单</td>
  </tr>
  <tr>
    <td>top</td>
    <td>在body下open-top</td>
    <td>打开顶部提示</td>
  </tr>
  <tr>
    <td>bottom</td>
    <td>在body下open-bottom</td>
    <td>打开底部提示</td>
  </tr>
  <tr>
    <td>modal</td>
    <td>在body下open-modal</td>
    <td>打开模态对话框，底部背景是黑色</td>
  </tr>
  <tr>
    <td>dialog</td>
    <td>在body下open-dialog</td>
    <td>打开对话框，底部没有背景</td>
  </tr>
  <tr>
    <td>popup</td>
    <td>在body下open-popup</td>
    <td>打开全屏对话框</td>
  </tr>
</table>

### 整体功能

+ Switch
+ Left、Right
+ Theme
+ Btns
+ Modals
+ Checkbox
+ Grid
+ List
+ Badge


### 外来力量

+ 引用require来模块化加载js
+ 引用jquery来操作dom
+ 引用jquery.dim来模块化操作数据
+ 引用fastclick来修复click
+ 引用iscroll来滚动和实现焦点图