<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>知识管理平台</h2>
      </el-col>
    </el-row>
    <div class="TopEchart" style="margin-bottom:100px;border:1px solid red">
      <el-row :gutter="20">
        <el-col :sm="24" :lg="12" style="margin-left:90px;margin-right:90px;padding-left: 20px">
          <div class="echart" id="myBarchart" :style="myChartBarStyle"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :lg="12" style="margin-left:90px;margin-right:90px;padding-left: 20px">
          <div class="echart" id="weather" :style="myChartWeatherStyle"></div>
        </el-col>
      </el-row>
    </div>
    <div class="box">
      <el-row :gutter="20">
        <el-col :sm="24" :lg="12" style="margin-left:90px;margin-right:90px;padding-left: 20px">
          <div class="echart" id="mychart" :style="myChartStyle"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :lg="12" style="margin-left:90px;margin-right:90px;padding-left: 20px">
          <div id="container" :style="myChartStyleLine"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import * as echarts from "echarts";
  export default {
    name: "Index",
    data() {
      return {
        // 版本号
        pieData: [{
            value: 463,
            name: "江苏"
          },
          {
            value: 395,
            name: "浙江"
          },
          {
            value: 157,
            name: "山东"
          },
          {
            value: 149,
            name: "广东"
          },
          {
            value: 147,
            name: "湖南"
          }
        ],
        pieName: [],
        myChartStyle: {
          float: "left",
          width: "400px",
          height: "400px"
        }, //图表样式
        myChartStyleLine: {
          float: "left",
          width: "300px",
          height: "300px"
        }, //图表样式
        xData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], //横坐标
        yData: [23, 24, 18, 25, 27, 28, 25], //数据
        myChartBarStyle: {
          float: "left",
          width: "300px",
          height: "300px"
        }, //图表样式
        myChartWeatherStyle: {
          float: "left",
          width: "300px",
          height: "300px"
        }, //图表样式
      };
    },
    mounted() {
      this.initDate(); //数据初始化
      this.initEcharts();
      this.initEchartsLine();
      this.initBarEcharts();
      this.weather()
    },
    methods: {
      goTarget(href) {
        window.open(href, "_blank");
      },
      // 柱状图
      initBarEcharts() {
        // 基本柱状图
        const option = {
          xAxis: {
            data: this.xData
          },
          yAxis: {},
          series: [{
            type: "bar", //形状为柱状图
            data: this.yData
          }]
        };
        const myChart = echarts.init(document.getElementById("myBarchart"));
        myChart.setOption(option);
        //随着屏幕大小调节图表
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      },
      // weather
      weather() {
        var dom = document.getElementById('weather');
        var option = {
          grid: {
            show: true,
            backgroundColor: 'transparent',
            opacity: 0.3,
            borderWidth: '0',
            top: '180',
            bottom: '0'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            show: false
          },
          xAxis: [
            // 日期
            {
              type: 'category',
              boundaryGap: false,
              position: 'top',
              offset: 130,
              zlevel: 100,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                formatter: [
                  '{a|{value}}'
                ].join('\n'),
                rich: {
                  a: {
                    // color: 'white',
                    fontSize: 18
                  }
                }
              },
              nameTextStyle: {

              },
              data: ["25日", "26日", "27日", "28日", "29日", "30日", "31日"]
            },
            // 星期
            {
              type: 'category',
              boundaryGap: false,
              position: 'top',
              offset: 110,
              zlevel: 100,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                formatter: [
                  '{a|{value}}'
                ].join('\n'),
                rich: {
                  a: {
                    // color: 'white',
                    fontSize: 14
                  }
                }
              },
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: 19
              },
              data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
            },
            // 天气图标
            {
              type: 'category',
              boundaryGap: false,
              position: 'top',
              offset: 20,
              zlevel: 100,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                formatter: function (value, index) {
                  return '{' + index + '| }\n{b|' + value + '}'
                },
                rich: {
                  0: {
                    backgroundColor: {
                      // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[0]] + '.png')
                      image: 'https://d.scggqx.com/forecast/img/小雨.png'
                    },
                    height: 40,
                    width: 40
                  },
                  1: {
                    backgroundColor: {
                      // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[1]] + '.png')
                      image: 'https://d.scggqx.com/forecast/img/小雨.png'
                    },
                    height: 40,
                    width: 40
                  },
                  2: {
                    backgroundColor: {
                      // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[2]] + '.png')
                      image: 'https://d.scggqx.com/forecast/img/阴.png'
                    },
                    height: 40,
                    width: 40
                  },
                  3: {
                    backgroundColor: {
                      // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[3]] + '.png')
                      image: 'https://d.scggqx.com/forecast/img/小雨.png'
                    },
                    height: 40,
                    width: 40
                  },
                  4: {
                    backgroundColor: {
                      // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[4]] + '.png')
                      image: 'https://d.scggqx.com/forecast/img/多云.png'
                    },
                    height: 40,
                    width: 40
                  },
                  5: {
                    backgroundColor: {
                      // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[5]] + '.png')
                      image: 'https://d.scggqx.com/forecast/img/小雨.png'
                    },
                    height: 40,
                    width: 40
                  },
                  6: {
                    backgroundColor: {
                      // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[6]] + '.png')
                      image: 'https://d.scggqx.com/forecast/img/小雨.png'
                    },
                    height: 40,
                    width: 40
                  },
                  b: {
                    // color: 'white',
                    fontSize: 12,
                    lineHeight: 30,
                    height: 20
                  }
                }
              },
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: 19
              },
              // data: this.weatherdata.weather
              data: ["小雨", "小雨", "阴", "小雨", "多云", "小雨", "小雨"]
            }
          ],
          yAxis: {
            type: 'value',
            show: false,
            axisLabel: {
              formatter: '{value} °C',
              color: 'white'
            }
          },
          series: [{
              name: '最高气温',
              type: 'line',
              data: ["16.3", "16.2", "17.6", "14.2", "17.6", "15.7", "14.3"],
              symbol: 'emptyCircle',
              symbolSize: 10,
              showSymbol: true,
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#C95843'
                }
              },
              label: {
                show: true,
                position: 'top',
                // color: 'white',
                formatter: '{c} °C'
              },
              lineStyle: {
                width: 1,
                // color: 'white'
              },
              areaStyle: {
                opacity: 1,
                color: 'transparent'
              }
            },
            {
              name: '最低气温',
              type: 'line',
              data: ["13.4", "12.8", "13.5", "12.5", "12.4", "13.2", "13"],
              symbol: 'emptyCircle',
              symbolSize: 10,
              showSymbol: true,
              smooth: true,
              itemStyle: {
                normal: {
                  color: 'blue'
                }
              },
              label: {
                show: true,
                position: 'bottom',
                // color: 'white',
                formatter: '{c} °C'
              },
              lineStyle: {
                width: 1,
                // color: 'white'
              },
              areaStyle: {
                opacity: 1,
                color: 'transparent'
              }
            }
          ]
        }
        console.log('option:', option)
      },
      initDate() {
        for (let i = 0; i < this.pieData.length; i++) {
          this.pieName[i] = this.pieData[i].name;
        }

      },
      // 饼形图示例
      /**
       * 饼图-样式
       */
      initEcharts() {
        // 饼图
        const option = {
          legend: {
            // 图例
            data: this.pieName,
            right: "10%",
            top: "30%",
            orient: "vertical"
          },
          title: {
            // 设置饼图标题，位置设为顶部居中
            text: "国内院士前五省份图示",
            top: "0%",
            left: "center"
          },
          series: [{
            type: "pie",
            label: {
              show: true,
              formatter: "{b} : {c} ({d}%)" // b代表名称，c代表对应值，d代表百分比
            },
            radius: "30%", //饼图半径
            data: this.pieData
          }]
        };
        const optionFree = {
          xAxis: {},
          yAxis: {},
          series: [{
            data: this.seriesData,
            type: "line",
            smooth: true
          }]
        };
        this.myChart = echarts.init(document.getElementById("mychart"));
        this.myChart.setOption(option);
        //随着屏幕大小调节图表
        window.addEventListener("resize", () => {
          this.myChart.resize();
        });
      },
      // 折线图
      initEchartsLine() {
        var dom = document.getElementById('container');
        var myChart = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });

        var option = {
          title: {
            text: 'Stacked Line'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
              name: 'Email',
              type: 'line',
              stack: 'Total',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: 'Union Ads',
              type: 'line',
              stack: 'Total',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: 'Video Ads',
              type: 'line',
              stack: 'Total',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: 'Direct',
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: 'Search Engine',
              type: 'line',
              stack: 'Total',
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        };

        if (option && typeof option === 'object') {
          myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
      }
    },
  };

</script>

<style scoped lang="scss">
  .home {
    blockquote {
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 17.5px;
      border-left: 5px solid #eee;
    }

    .box {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      border: 1px solid black;
    }

    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid #eee;
    }

    .col-item {
      margin-bottom: 20px;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    font-family: "open sans",
    "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;

    ul {
      list-style-type: none;
    }

    h4 {
      margin-top: 0px;
    }

    h2 {
      margin-top: 10px;
      font-size: 26px;
      font-weight: 100;
    }

    p {
      margin-top: 10px;

      b {
        font-weight: 700;
      }
    }

    .update-log {
      ol {
        display: block;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding-inline-start: 40px;
      }
    }
  }

</style>
