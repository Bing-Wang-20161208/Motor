//滑动缓动动画
function animate(obj, json, t, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true,//何时清除定时器
            step = 0,//步长
            current = 0;//当前的状态
        for (var attr in json) {//json里面的属性
//1.获取当前值
            if (attr == 'opacity') {//取当前值，当前透明度
                current = parseInt(window.getComputedStyle(obj, null)[attr] * 100);
            } else {//其他当前值
                current = parseInt(window.getComputedStyle(obj, null)[attr]);
            }
//2.计算步长
            step = (json[attr] - current) / 10;//缓动公式
            step = step < 0 ? Math.floor(step) : Math.ceil(step);//两端到底
//3.动画开始，当前值 + 步长 = 期望值
            if (attr == 'opacity') {//动画开始，透明度
                if ('opacity' in obj.style) {//W3C浏览器
                    obj.style[attr] = (current + step) / 100;
                } else {//IE浏览器
                    obj.style[attr] = 'alpha(opacity='+ (current + step) +')';
                }
            } else if (attr == 'zIndex') {//层级
                obj.style[attr] = json[attr];
            } else {//其他
                obj.style[attr] = current + step + 'px';
            }
//4.确定动画的完成，为了清除定时器
            if (current != json[attr]) {//判断当所有动画完成时，flag=true
                flag = false;
            }
        }
        if (flag) {//flag=true时，清除定时器
            clearInterval(obj.timer);
//5.节流，避免动画没完成就被用户打乱，进入第二次运动，影响用户体验
            if (fn) {//当动画完成之后，才执行这个函数，相当于节流
                fn();
            }
        }
    }, t);
}
//旋转轮播图
//1.获取DOM元素
var slide = document.getElementById('slide'),
    slide_img_items = slide.children[0].children,
    slide_ctrl = slide.children[1],
    slide_ctrls = slide_ctrl.children;
//2.json设置图片位置
var json = [
    {
        w: 200,
        h: 150,
        x: 700,
        y: 0,
        o: 20,
        z: 2
    },
    {
        w: 200,
        h: 150,
        x: 450,
        y: 0,
        o: 20,
        z: 2
    },
    {
        w: 350,
        h: 300,
        x: 200,
        y: 80,
        o: 60,
        z: 6
    },
    {
        w: 450,
        h: 300,
        x: 20,
        y: 150,
        o: 80,
        z: 8
    },
    {
        w: 600,
        h: 450,
        x: 383,
        y: 190,
        o: 100,
        z: 10
    },
    {
        w: 450,
        h: 300,
        x: 870,
        y: 150,
        o: 80,
        z: 8
    },
    {
        w: 350,
        h: 300,
        x: 800,
        y: 80,
        o: 60,
        z: 6
    },
]
var save = true;//节流，使得每一个动画都能够完全执行一遍
change();//最初的模样
for(var k in slide_ctrls){//点击动画
    slide_ctrls[k].onclick = function () {
        if (this.className == 'slide-ctrl-prev') {//prev
            if (save) {
                change(false);
                save = false;
            }
        } else {//next
            if (save) {
                change(true);
                save = false;
            }
        }
    }
}
//5.autoplay
var timer = null;
timer = setInterval(function () {
    change(true);
}, 1500);
//3.prev,next的动画显示及运用动画函数定位，及开启和关闭定时器
slide.onmouseover = function () {
    clearInterval(timer);
    animate(slide_ctrl, {opacity: 100}, 10);
}
slide.onmouseout = function () {
    animate(slide_ctrl, {opacity: 0}, 10);
    timer = setInterval(function () {
        change(true);
    }, 1500);
}
//4.共有动画函数
function change(flag) {//根据flag = true|flase，判断上一张或者是下一张
    if (flag) {//next
        json.unshift(json.pop());
    } else {//prev
        json.push(json.shift());
    }
    for (var i = 0; i < slide_img_items.length; i ++) {//图片与图片的索引没变，与json的索引对应，只是json数组元素的排列顺序引发了动画
        animate(slide_img_items[i], {
            width: json[i].w,
            height: json[i].h,
            top: json[i].y,
            left: json[i].x,
            opacity: json[i].o,
            zIndex: json[i].z
        }, 30, function () {
            save = true;
        });
    }
}
//图像点击即转动，小方块儿模拟实现点击
var slide_square_items = slide.children[2].children;
for (var i = 0; i < slide_square_items.length; i ++) {
    slide_square_items[i].style['width'] = json[i].w + 'px';
    slide_square_items[i].style['height'] = json[i].h + 'px';
    slide_square_items[i].style['top'] = json[i].y + 'px';
    slide_square_items[i].style['left'] = json[i].x + 'px';
    slide_square_items[i].style['opacity'] = json[i].o;
    slide_square_items[i].style['zIndex'] = json[i].z;
    slide_square_items[i].innerHTML = i;
    slide_square_items[i].onclick = function () {
        var that = this.innerHTML,//充当点击的小方块儿索引值
            step = 3 - that;//要点击方块儿和当前最近方块儿相差多少innerHTML，当前最近方块儿innerHTML=3
        if (step < 0) {//点击中心右边的图像
            if (save) {
                toChange(true, Math.abs(step));
                save = false;
            }
        } else if (step > 0) {//点击中心左边的图像
            if (save) {
                toChange(false, step);
                save = false;
            }
        }
    }
}
function toChange(flag, times) {//根据flag = true|flase，判断上几张或者是下几张
    if (flag) {//next
        for (var i = 0; i < times; i ++) {
            json.unshift(json.pop());
        }
    } else {//prev
        for (var i = 0; i < times; i ++) {
            json.push(json.shift());
        }
    }
    for (var i = 0; i < slide_img_items.length; i ++) {//图片与图片的索引没变，与json的索引对应，只是json数组元素的排列顺序引发了动画
        animate(slide_img_items[i], {
            width: json[i].w,
            height: json[i].h,
            top: json[i].y,
            left: json[i].x,
            opacity: json[i].o,
            zIndex: json[i].z
        }, 30, function () {
            save = true;
        });
    }
}    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    