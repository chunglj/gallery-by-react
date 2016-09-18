'use strict';

var React = require('react/addons');
// var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');

// 获取图片相关信息
var imgDatas = require('../data/imageData.json');

// 利用自执行函数，图片信息转换成URL
imgDatas = (function genImgUrl(imageDataArr) {
  for (var i = 0; i < imageDataArr.length; i++) {
    var singleImgData = imageDataArr[i];
    singleImgData.imageURL = require('../images/' + singleImgData.fileName);

    imageDataArr[i] = singleImgData;
  }
  return imageDataArr;
})(imgDatas);

// 图片组件
var ImgFigure = React.createClass({
  // imgFigure的点击处理函数
  handleClick: function (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();

  },


  render: function () {
    var styleObj = {};

    // 如果Props指定了这张图片的信息，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值且不为0，添加角度
    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
});

// 获取区间随机数
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

// 获取0-30度之间任意的正负值
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

var ControllerUnit = React.createClass({
  handleClick: function (e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },

  render: function () {
    var controllerUnitClassName = 'controller-unit';
    // 如果对应的图片居中，显示居中态
    if(this.props.arrange.isCenter){
      controllerUnitClassName += ' is-center';

      // 如果是反转态，则显示翻转态
      if(this.props.arrange.isInverse){
        controllerUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
});

var GalleryByReactApp = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },

    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },

    vPosRange: {
      topY: [0, 0],
      x: [0, 0]
    }
  },

  // 反转图片
  inverse: function (index) {
    return function () {
      var imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;

      this.setState({
        imgArrangeArr: imgArrangeArr
      });
    }.bind(this);
  },

  // 重新布局所有图片
  rearrange: function (centerIndex) {
    var imgArrangeArr = this.state.imgArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),  //取一个或不取
      topImgSpliceIndex = 0,
      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

    // 居中centerIndex的图片,居中的图片不旋转
    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    // 取出布局上侧状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧图片
    imgArrangeTopArr.forEach(function (value, index) {
      imgArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };

    });

    // 布局两侧的图片
    for (var i = 0, len = imgArrangeArr.length, k = len / 2; i < len; i++) {
      var hPosRangeLORX = null;

      // 前半部分在左边,后半部分在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    if (imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }

    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

    this.setState({
      imgArrangeArr: imgArrangeArr
    });


  },

  getInitialState: function () {
    return {
      imgArrangeArr: [

      ]
    };
  },

  // 利用rearrange函数居中index的图片
  center: function (index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  },

  // 组建加载后，为每张图片计算范围
  componentDidMount: function () {

    // 拿到舞台大小
    var stageDOM = React.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到ImageFigure的大小
    var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左侧／右侧排布位置范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[0] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧排布范围
    this.Constant.vPosRange = {
      topY: [-halfImgH, halfStageH - halfImgH * 3],
      x: [halfStageW - imgW, halfStageW]
    };

    this.rearrange(0);

  },

  render: function () {
    var controllerUnits = [];
    var imgFigure = [];
    imgDatas.forEach(function (item, index) {
      if (!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      imgFigure.push(<ImgFigure key={index} data={item} ref={'imgFigure' + index} arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index) } center={this.center(index) }/>);
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigure}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
