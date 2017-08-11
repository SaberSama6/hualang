require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//获取图片相关数组，将图片名转换为图片路径。
let imageDatas=require("../data/imagesData.json");
function genImageURL(imageDatasArr){
  for(var i=0,j=imageDatasArr.length;i<j;i++){
    var singleImageData=imageDatasArrp[i];
    singleImageData.imageURL=require("../images"+singleImageData.fileName);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr;
}

imageDatas=genImageURL(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
          <section className="img-sec">

          </section>
          <nav className="controller-nav">
        
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
