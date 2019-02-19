//点击开始游戏 -》 动态生成100个小格--》100div
//leftClick  没有雷  --》显示数字（代表以当前小格为中心周围8个格的雷数） 扩散（当前周围八个格没有雷）
//           有累 --》game Over
//rightClick 没有标记并且没有数字--》进行标记。 有标记 --》取消标记 --》标记是否正确，10个都正确标记，提示成功
//已经出现数字--》无效果
var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var score = document.getElementById('score');
var closeBtn = document.getElementById('colseBtn');
var minesNum;
var minesOver;

var mineMap = [];
var key = true;
bindEvent();
function bindEvent() {
    startBtn.onclick = function () {
        box.style.display = 'block';
        flagBox.style.display = 'block';

        if (key) {
            init();
        }

    }
    box.oncontextmenu = function () {
        return false;
    }
    box.onmousedown = function (e) {
        var event = e.target;//被点击的格子
        if (e.which == 1) {
            leftClick(event);//调用左键方法
        } else if (e.which == 3) {
            rightClick(event);//调用右键方法
        }

    }
    closeBtn.onclick = function () {
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        key = true;
    }
}
function init() {   //初始化函数
    minesNum = 10;  //初始化雷数量
    minesOver = 10;
    score.innerHTML = minesOver;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id', i + '-' + j);//备取
            box.appendChild(con);
            mineMap.push({ mine: 0 }); // 雷状态标记
        }
    }
    block = document.getElementsByClassName('block');
    while (minesNum) {//生成10个雷
        var mineIndex = Math.floor(Math.random() * 100);//要生成雷的位置
        if (mineMap[mineIndex].mine === 0) {
            block[mineIndex].classList.add('islei');//若当前位无雷，生成雷
            mineMap[mineIndex].mine = 1;//状态改为有雷
            minesNum--;
        }
    }
    key = false;
}

function leftClick(dom) {
    var islei = document.getElementsByClassName('islei');
    if (dom && dom.classList.contains('islei')) {    //如果有雷
        console.log('gameover');
        for (var i = 0; i < islei.length; i++) {
            islei[i].classList.add('show'); //全部显示
        }
        setTimeout(function () {
            alertBox.style.display = 'block';   //弹出提示
            alertImg.classList.add('alertImg2');
        }, 800)
    } else {
        var n = 0;//计数
        var posArr = dom && dom.getAttribute('id').split('-');// 取到格子id以'-'拆分为数组 &&容错
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];   //格子取到坐标
        // console.log(posX,posY);
        dom && dom.classList.add('num');
        // i行j列 
        //         (i-1,j-1)  (i-1,j)  (i-1,j+1)  
        //         (i,j-1)    (i,j)    (i,j+1)  
        //         (i+1,j-1)  (i+1,j)  (i+1,j+1)  
        for (var i = posX - 1; i <= posX + 1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var aroundBox = document.getElementById(i + '-' + j);//取到上面的ID
                if (aroundBox && aroundBox.classList.contains('islei')) {
                    n++;
                }
            }
        }
        // console.log(n);
        dom && (dom.innerHTML = n);
        if (n == 0) {    //如果是0，遍历，继续扩散
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY -1 ; j <= posY + 1; j++) {
                    var fujinBox = document.getElementById(i + '-' + j);//取到上面的ID
                    if (fujinBox && fujinBox.length != 0) {
                        if (!fujinBox.classList.contains('check')) { //如果无标记 
                            fujinBox.classList.add('check'); //添加标记
                            leftClick(fujinBox);    //调用左键方法，递归
                        }


                    } 
                }
            }

        }
    }
}

function rightClick(dom) {
    if (dom.classList.contains('num')) {
        return;
    } else {
        dom && dom.classList.toggle('flag');//切换class
        if (dom.classList.contains('islei') && dom.classList.contains('flag')) {
            minesOver--;
        }
        if (dom.classList.contains('islei') && !dom.classList.contains('flag')) {
            minesOver++;
            dom.classList.remove('flag');
        }

        score.innerHTML = minesOver;
        if (minesOver == 0) {
            setTimeout(function () {
                alertBox.style.display = 'block';   //弹出提示
                alertImg.classList.toggle('alertImg1');
            }, 800)

        }
    }
}