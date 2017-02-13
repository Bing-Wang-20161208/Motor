//运动动画
function animate(obj, json, t, fn) {
    clearInterval(obj.timer);//使用定时器之前的清除
    obj.timer = setInterval(function () {
        var current = 0,
            step = 0,
            flag = true;//判断何时清除定时器
        for ( var attr in json) {//遍历传过来的json包含那些对属性
            if (attr == 'opacity') {//判断是否是透明度，并获取当前状态
                current = parseInt(window.getComputedStyle(obj, null)[attr] * 100);//获取当前元素某一属性的属性值
            } else {//其他，类似于zIndex,width,height,left,top等
                current = parseInt(window.getComputedStyle(obj, null)[attr]);
            }
            step = (json[attr] - current) / 10;//下一行一定不能与本行合并
            step = step < 0 ? Math.floor(step) : Math.ceil(step);//步长，每一步走的距离
            if (attr == 'opacity') {//开始动画
                if ('opacity' in obj.style) {
                    obj.style[attr] = (current + step) / 100;//动画公式
                } else {
                    obj.style[attr] = 'alpha(opacity='+ (current + step) +')';
                }
            } else if (attr == 'zIndex') {
                obj.style[attr] = json[attr];
            } else {
                obj.style[attr] = current + step + 'px';
            }
            if (current != json[attr]) {
                flag = false;//当所有的动画都完成之后，跳出循环
            }
        }
        if (flag) {//跳出循环时，flag为true，清楚定时器
            clearInterval(obj.timer);
            if (fn) {//当每一次动画全部完成之后，才开始下一次动画
                fn();
            }
        }
    },t);
}
//轮播图
var slide = document.getElementById('slide'),
    slide_img_items = slide.children[0].children,
    slide_ctrl = slide.children[1];
//1.添加小方块儿
for (var i = 0; i < slide_img_items.length; i ++) {//遍历img，通过img的数量动态添加span
    var slide_ctrl_item = document.createElement('span');
    slide_ctrl_item.innerHTML = slide_img_items.length - i;//因为是倒叙插，所以需要反着加数字,这里的数字-1当成span的索引号使用
    slide_ctrl_item.setAttribute('class', 'slide-ctrl-item');
    slide_ctrl.insertBefore(slide_ctrl_item, slide_ctrl.children[1]);
}
//2.手动轮播
var slide_ctrl_items = slide_ctrl.children,
    slide_w = slide.clientWidth,
    iNow = 0;//用于获取图片的当前索引
slide_ctrl_items[1].setAttribute('class', 'slide-ctrl-item on');
for (var i = 1; i < slide_img_items.length; i ++) {//摆放图片，将所有的除了第一张的图片放在右边
    slide_img_items[i].style.left = slide_w + 'px';
}
for (var k in slide_ctrl_items) {//循环遍历每一个span
    slide_ctrl_items[k].onclick = function () {//当前的span
        if (this.className == 'slide-ctrl-prev') {//上一张
            animate(slide_img_items[iNow], {left: slide_w}, 10);
            --iNow < 0 ? iNow = slide_img_items.length - 1 : iNow;
            slide_img_items[iNow].style.left = -slide_w + 'px';
            animate(slide_img_items[iNow], {left: 0}, 10);
            setSquare();
        } else if (this.className == 'slide-ctrl-next') {//下一张
            autoplay();
            setSquare();
        } else {//剩下的小方块儿的动画
            var that = this.innerHTML - 1;//利用innerHTML作为索引值
            if (iNow < that) {//图片向左走,类似于下几张
                animate(slide_img_items[iNow], {left: -slide_w}, 20);
                slide_img_items[that].style.left = slide_w + 'px';
            } else if (iNow > that) {//图片向右走，类似于上几张
                animate(slide_img_items[iNow], {left: slide_w}, 20);
                slide_img_items[that].style.left = -slide_w + 'px';
            }
            iNow = that;//当前这一张的索引复制
            animate(slide_img_items[iNow], {left: 0}, 20);
            setSquare();
        }
    }
}
function setSquare() {//小方块儿颜色的改变
    for (var i = 1; i < slide_ctrl_items.length - 1; i ++) {
        slide_ctrl_items[i].className = 'slide-ctrl-item';
    }
    slide_ctrl_items[iNow + 1].setAttribute('class', 'slide-ctrl-item on');
}
//3.自动轮播
var timer = null;
timer = setInterval(autoplay, 1000);
function autoplay() {//手动的下一张
    animate(slide_img_items[iNow], {left: -slide_w}, 10);
    ++iNow > slide_img_items.length - 1 ? iNow = 0 : iNow;
    slide_img_items[iNow].style.left = slide_w + 'px';
    animate(slide_img_items[iNow], {left: 0}, 10);
    setSquare();
}
//开启与关闭定时器
slide.onmouseover = function () {
    clearInterval(timer);
}
slide.onmouseout = function () {
    clearInterval(timer);
    timer = setInterval(autoplay, 1000);
}




























