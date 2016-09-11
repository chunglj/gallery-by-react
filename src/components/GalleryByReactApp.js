'use strict';

var React = require('react/addons');
// var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');

// 获取图片相关信息
// var imageDatas = require('../data/imageData.json');

// 利用自执行函数，图片信息转换成URL
// imgDatas = (function genImgUrl(imageDataArr){
//   for(var i = 0; i < imageDataArr.length; i++){
//     var singleImgData = imageDataArr[i];
//     singleImgData.imageURL = require('../images/' + singleImgData.fileName);

//     imageDataArr[i] = singleImgData;
//   }
//   return imageDataArr;
// })(imgDatas);

var GalleryByReactApp = React.createClass({
  render: function() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
