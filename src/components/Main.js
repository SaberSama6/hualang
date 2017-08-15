require('normalize.css/normalize.css');
require('../styles/App.scss');

import React from 'react';
import ReactDom from 'react-dom';
//获取图片相关数组，将图片名转换为图片路径。
var imageDatas = require('../data/imagesData.json');

function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
}

imageDatas = genImageURL(imageDatas);

//获取区间内的一个随机值
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

//获取0-30度之间的任意正负值
function get30DegRandom(){
  return (Math.random()>0.5?'':'-')+ Math.ceil(Math.random()*30)
}

var ImgFigure = React.createClass({
    handleClick:function(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    render: function() {
        var styleObj={};
        //如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
          styleObj=this.props.arrange.pos;
        }
        //如果图片的旋转角度有值并且不为0，增加旋转角度
        if(this.props.arrange.rotate){
            styleObj['transform']='rotate('+this.props.arrange.rotate+'deg)';
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex=11;
        }

        var imgFigureClassName='img-figure';
        imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';
        return (
        <figure className = {imgFigureClassName} style={styleObj} onClick={this.handleClick}>
            <img src = { this.props.data.imageURL }
            alt = { this.props.data.title }
            />
            <figcaption >
                <h2 className ='img-title'>{this.props.data.title}</h2>
                <div className='img-back' onClick={this.handleClick}>
                    <p>
                        {this.props.data.desc}
                    </p>
                </div>
            </figcaption >
        </figure>
        )
    }
})
//控制组件
var ControllerUnit=React.createClass({
    handleClick:function(e){
        //如果点击的是当前正在选中态的按钮，则翻转图片，否则居中
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    },
    render:function(){
        var ControllerUnitClassName='controller-unit';
        if(this.props.arrange.isCenter){
            ControllerUnitClassName+=' is-center';
            if(this.props.arrange.isInverse){
                ControllerUnitClassName+=' is-inverse';
            }
        }
        return(
            <span className={ControllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
})

var AppComponent = React.createClass({
            render:function() {
                var controllerUnits = [],
                    ImgFigures = [];
                imageDatas.forEach(function(value, index) {
                        if (!this.state.imgsArrangeArr[index]) {
                            this.state.imgsArrangeArr[index] = {
                                pos: {
                                    lefr: 0,
                                    top: 0
                                },
                                rotate:0 ,
                                isInverse:false,
                                isCenter:false
                            }
                        }
                        ImgFigures.push( < ImgFigure data = { value }
                            ref = { 'imgFigure' + index } arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                            center={this.center(index)}/>);

                        controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
                        }.bind(this));
                    return ( <section className = "stage"
                        ref = "stage" >
                        <section className = "img-sec" > { ImgFigures }
                          </section>
                          <nav className = "controller-nav"> { controllerUnits } </nav>
                          </section >
                    );
                },
            Constant: {
                centerPos: { //中心区域的取值范围
                    left: 0,
                    right: 0
                },
                hPosRange: { //水平方向的取值范围
                    leftSecX: [0, 0],
                    rightSecX: [0, 0],
                    y: [0, 0]
                },
                vPosRange: {
                    x: [0, 0],
                    topY: [0, 0]
                }
            },

            //翻转图片
            inverse:function(index){
                return function(){
                    var imgsArrangeArr=this.state.imgsArrangeArr;

                    imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;

                    this.setState({
                        imgsArrangeArr:imgsArrangeArr
                    })
                }.bind(this);
            },




            //重新布局所有图片
            rearrange:function(centerIndex) {
                var imgsArrangeArr = this.state.imgsArrangeArr,
                    Constant = this.Constant,
                    centerPos = Constant.centerPos,
                    hPosRange = Constant.hPosRange,
                    vPosRange = Constant.vPosRange,
                    hPosRangeLeftSecX = hPosRange.leftSecX,
                    hPosRangeRightSecX = hPosRange.rightSecX,
                    hPosRangeY = hPosRange.y,
                    vPosRangeTopY = vPosRange.topY,
                    vPosRangeX = vPosRange.x,

                    imgsArrangeTopArr = [],
                    topImgNum = Math.floor(Math.random() * 2),
                    topImgSpliceIndex = 0,

                    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

                //首先居中 centerIndex图片,居中的图片不需要旋转

                imgsArrangeCenterArr[0]={
                    pos:centerPos,
                    rotate:0,
                    isCenter:true
                }

                //取出要布局上侧的图片状态信息
                topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

                imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

                //布局上面的图片
                imgsArrangeTopArr.forEach(function(value, index) {
                    imgsArrangeTopArr[index]={
                        pos:{
                             top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                             left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                        },
                        rotate:get30DegRandom(),
                        isCenter:false
                    }
                })

                //布局左右的图片
                for (var i = 0, j = imgsArrangeArr.length,k = j / 2; i < j; i++) {
                    var hPosRangeLORX = null;
                    if (i < k) {
                        hPosRangeLORX = hPosRangeLeftSecX;
                    } else {
                        hPosRangeLORX = hPosRangeRightSecX;
                    }

                    imgsArrangeArr[i]={
                        pos:{
                            top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                            left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                        },
                        rotate:get30DegRandom(),
                        isCenter:false
                    }
                }

                if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
                    imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
                }

                imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

                this.setState({
                    imgsArrangeArr: imgsArrangeArr
                });
            },
            // 利用rearrange函数，居中对应index的图片
            center:function(index){
                return function(){
                    this.rearrange(index);
                }.bind(this);
            },
            getInitialState:function() {
                return {
                    imgsArrangeArr: [
                        // {
                        //   pos:{
                        //     left:"0",
                        //     top:"0"
                        //   },
                        //   rotate:0, //图片的旋转角度
                        //   isInverse:false //图片当前的正反面
                        //   isCenter:false //图片是否居中
                        // }
                    ]
                }
            },

            //组件加载后为每张图片计算范围
            componentDidMount:function() {
                //拿到舞台的大小
                var stageDom = ReactDom.findDOMNode(this.refs.stage),
                    stageW = stageDom.scrollWidth,
                    stageH = stageDom.scrollHeight,
                    halfStageW = Math.ceil(stageW / 2),
                    halfStageH = Math.ceil(stageH / 2);
                //拿到imgFigure的大小
                var imgFigureDOM = ReactDom.findDOMNode(this.refs.imgFigure0),
                    imgW = imgFigureDOM.scrollWidth,
                    imgH = imgFigureDOM.scrollHeight,
                    halfimgW = Math.ceil(imgW / 2),
                    halfimgH = Math.ceil(imgH / 2);
                      
                //计算中心图片的位置点
                this.Constant.centerPos = {
                        left: halfStageW - halfimgW,
                        top: halfStageH - halfimgH
                    }
                    //计算左
                this.Constant.hPosRange.leftSecX[0] = -halfimgW;
                this.Constant.hPosRange.leftSecX[1] = halfStageW - halfimgW * 3;
                this.Constant.hPosRange.rightSecX[0] = halfStageW + halfimgW;
                this.Constant.hPosRange.rightSecX[1] = stageW - halfimgW;
                this.Constant.hPosRange.y[0] = -halfimgH;
                this.Constant.hPosRange.y[1] = stageH - halfimgH;
                //计算右排布位置的取值范围
                this.Constant.vPosRange.topY[0] = -halfimgH;
                this.Constant.vPosRange.topY[1] = halfStageH - halfimgH * 3;
                this.Constant.vPosRange.x[0] = halfStageW - imgW;
                this.Constant.vPosRange.x[1] = halfStageW;

                this.rearrange(0);
            }
            })

        AppComponent.defaultProps = {};

        export default AppComponent;