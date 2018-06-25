# An demo showing how to user rel="preload"

This is a simple demo page showing how to use `rel="preload"` and compare the effect of image with preload ot not.


You can see [live demo here](https://pjchender.github.io/preload-resource-example/index.html).

## Usage

```bash
npm install
npm run start
```
1. Enter the [live demo URL](https://pjchender.github.io/preload-resource-example/index.html) on your browser.
2. Wait until the alert message, "preload image  onload", which denpends on your network speed
3. Click the buttons with the same action below. The left one will request a preload image, and the right one will make a normal request.
4. You can see by clicking button which request for a preload image will display the image instantly. However, the other one loads the image slowly and  gradully.

![](https://i.imgur.com/Wb1A57b.gif)

## Notes

For latest notes, check [pjchender.github.io](https://pjchender.github.io/).

###### keywords: `preload`, `prefetch`, `render-blocking`

>  [Preloading content with rel="preload"](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) @ MDN

當請求一個資源的時候，如果該資源存取完畢前無法觸發 `window.onload` 的事件，就稱作是 **`render-blocking`**。

## 使用 rel="preload"

**透過在 `<link>` 中使用 `rel="preload"` 可以在<u>此頁（current page）</u>預先載入（preload）稍後需要使用的資源，讓它們在稍後瀏覽器進行頁面渲染的時候可以立即被使用**，預先載入特別適合用在載入 CSS 字體檔、圖片或是較大的影音檔案。

**要注意的是，透過 `preload` 只會提前去請求該資源，然後存在記憶體中，在你需要的時候自己再去使用（只限同一頁面）**。

```html
<head>
  <meta charset="utf-8">
  <title>JS and CSS preload example</title>
  <!--★★★★★ -->
  <link rel="preload" href="style.css" as="style">    <!-- stylesheet -->
  <link rel="preload" href="main.js" as="script">     <!-- script -->
  <link rel="preload" href="main.js" as="image">    <!-- image -->
   
  <!-- MIME Type -->
  <link rel="preload" href="sintel-short.mp4" as="video" type="video/mp4"> <!-- mp4 -->
  <link rel="preload" href="fonts/foo.woff" as="font" type="font/woff" crossorigin="anonymous">  <!-- woff font -->
  <link rel="preload" href="fonts/zantroke-webfont.ttf" as="font" type="font/ttf" crossorigin="anonymous">  <!-- ttf font -->
  <link rel="preload" href="fonts/zantroke-webfont.svg" as="font" type="image/svg+xml" crossorigin="anonymous">  <!-- svg font -->
    
  <!-- media query preload -->
  <link rel="preload" href="bg-image-narrow.png" as="image" media="(max-width: 600px)">
  <link rel="preload" href="bg-image-wide.png" as="image" media="(min-width: 601px)">
    
  <!-- preload 只是做預先下載的動作，還是自己使用它才有效 -->
  <link rel="stylesheet" href="style.css">
</head>
```

> :exclamation: preload 只是做預先下載的動作，還是要在需要的地方使用它。

### 預先載入 script 後使用

```js
// <link rel="preload" href="myscript.js" as="script">
var preloadLink = document.createElement("link");
preloadLink.href = "myscript.js";
preloadLink.rel = "preload";
preloadLink.as = "script";
document.head.appendChild(preloadLink);
```

在需要用到時再載入

```js
// <script src="myscript.js"></script>
var preloadedScript = document.createElement("script");
preloadedScript.src = "myscript.js";
document.body.appendChild(preloadedScript);
```

### 實測結果

測試程式碼：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preload" href="https://c2.staticflickr.com/8/7151/6760135001_14c59a1490_o.jpg" as="image">
</head>
    
<body>
  <h1>Hello</h1>
  <img style="max-width: 100%; height:  auto;"src="https://c2.staticflickr.com/8/7151/6760135001_14c59a1490_o.jpg">
  <script src="app.js"></script>
</body>
</html>
```

實際測試後，Chrome 在有下 `preload` 的情況下，**不論內文有沒有用到該資源，都會先去把該資源載下來**：

- 上圖是沒有用 preload，會按照各資源在 HTML 中的順序載入，所以先載 `*.css` 才載 `.jpg`
- 下圖是有用 preload，會先把要 preload 的資源（`*.jpg`）載入後，才開始下載 `*.css`

![](https://i.imgur.com/uGpzkmg.png)

## 使用 rel="prefetch"

和 `rel="preload"` 會預先載入<u>此頁</u>要用的資源不同，`rel="prefetch"` 主要是用在<u>下一頁</u>會使用到該資源時預先載入；此外，瀏覽器會給予 `preload` 較高的優先順序（因為這頁就要用到）。

```html
<!-- 實際測試的結果 prefetch 似乎沒有效果，仍然只能在此頁被使用 -->
<link rel="prefetch" href="/images/big.jpeg">
```

> [Link prefetching FAQ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ) @ MDN

## 圖片相關 Image Related

### Image Preload by src

#### 預載圖片（image preload）

```javascript
let img = new Image(200, 100);
img.src = 'https://foo.bar';
```

#### 檢查圖片是否加載完成

```javascript
// NOTICE: onload 要寫在 src 前，才能確保不會已經 load 完後才去註冊 load 事件。
var imag = new Image();

img.onload = function (e) {
  console.log('image preloaded')
}

imgae.src = 'url'
```

#### 圖片錯誤處理（自動修復破圖）

```javascript
// NOTICE: onerror 要寫在 src 前，才能確保不會已經 error 後才去註冊 error 事件。

img.onerror = function (e) {
  let hasImgBrokenClass = this.classList.contains('img-broken');
  if (!hasImgBrokenClass) {
  this.src = 'img/oops.png';
    this.classList.add('img-broken');
  };
}
```

### 使用 background-image

使用 CSS 中的 background-image 來載入圖片的話，理論上：

1. 直到 CSSOM 被建構完成前，瀏覽器不會觸發下載影像（因此下載會產生阻塞）
2. 如果在 CSS 中該影像被設定為 `display:none;` 則該影像不會下載。

### 使用 img 標籤

使用 `<img src="foobar.png">` 標籤來載入圖片的話，理論上：

1. 瀏覽器會處理到 `<img/>` 標籤時直接下載圖片，而不會等到 CSSOM 建構完成，因此不會產生阻塞的情況。
2. 也因此使用 `<img/>` 下載的圖片，即時使用 `display:none;` 也還是會把該圖片下載下來。

> `2018-06-25`：實做時 Firefox 有些不同，可參考 [Image Inconsistencies: How and When Browsers Download Images](https://csswizardry.com/2018/06/image-inconsistencies-how-and-when-browsers-download-images/) @ csswizardry 

## 參考

- [HTML Link Types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types) @ MDN
- [Link prefetching FAQ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ) @ MDN
- [Using Preload and Prefetch in Your HTML to Load Assets](https://alligator.io/html/preload-prefetch/) @ Alligator
- [Image Inconsistencies: How and When Browsers Download Images](https://csswizardry.com/2018/06/image-inconsistencies-how-and-when-browsers-download-images/) @ csswizardry 


## Credit

The npm start script is from [Wes Bos](https://github.com/wesbos).
