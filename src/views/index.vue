<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col style="padding-left: 20px">
        <h2>知识管理平台</h2>
      </el-col>
    </el-row>
    <div class="chart">
      <div class="pieChart">
        <el-row :gutter="20">
          <el-col :sm="24" :lg="12">
            <div class="echart" id="mychart" :style="myChartStyle"></div>
          </el-col>
        </el-row>
      </div>
      <div class="linBarChart">
        <el-row :gutter="20">
          <el-col :sm="24" :lg="12">
            <div class="echart" id="myMaxbar" :style="{width: '500px', height: '300px'}"></div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="lineChart">
      <div class="line-container">
        <el-row :gutter="20">
          <el-col :sm="24" :lg="12" style="margin-right:90px;padding-left: 20px">
            <div id="container" :style="myChartStyleLine"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from "echarts";
  export default {
    components: {},
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
        myChartStyle: { // 饼形图
          float: "left",
          width: "400px",
          height: "400px"
        },
        myChartStyleLine: { //折线图样式
          float: "left",
          width: "900px",
          height: "300px"
        },
      };
    },
    mounted() {
      this.initDate(); //数据初始化
      this.initEcharts(); // 饼图-样式
      this.initEchartsLine(); // 折线图
      this.drawLine();
    },
    methods: {
      goTarget(href) {
        window.open(href, "_blank");
      },
      // 折线柱状图
      drawLine() {
        var chartDom = document.getElementById('myMaxbar');
        var myChart = echarts.init(chartDom);
        var option;

        const yearCount = 7;
        const categoryCount = 30;
        const xAxisData = [];
        const customData = [];
        const legendData = [];
        const dataList = [];
        legendData.push('trend');
        const encodeY = [];
        for (var i = 0; i < yearCount; i++) {
          legendData.push(2010 + i + '');
          dataList.push([]);
          encodeY.push(1 + i);
        }
        for (var i = 0; i < categoryCount; i++) {
          var val = Math.random() * 1000;
          xAxisData.push('category' + i);
          var customVal = [i];
          customData.push(customVal);
          for (var j = 0; j < dataList.length; j++) {
            var value =
              j === 0 ?
              echarts.number.round(val, 2) :
              echarts.number.round(
                Math.max(0, dataList[j - 1][i] + (Math.random() - 0.5) * 200),
                2
              );
            dataList[j].push(value);
            customVal.push(value);
          }
        }
        option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legendData
          },
          dataZoom: [{
              type: 'slider',
              start: 50,
              end: 70
            },
            {
              type: 'inside',
              start: 50,
              end: 70
            }
          ],
          xAxis: {
            data: xAxisData
          },
          yAxis: {},
          series: [{
              type: 'custom',
              name: 'trend',
              renderItem: function (params, api) {
                var xValue = api.value(0);
                var currentSeriesIndices = api.currentSeriesIndices();
                var barLayout = api.barLayout({
                  barGap: '30%',
                  barCategoryGap: '20%',
                  count: currentSeriesIndices.length - 1
                });
                var points = [];
                for (var i = 0; i < currentSeriesIndices.length; i++) {
                  var seriesIndex = currentSeriesIndices[i];
                  if (seriesIndex !== params.seriesIndex) {
                    var point = api.coord([xValue, api.value(seriesIndex)]);
                    point[0] += barLayout[i - 1].offsetCenter;
                    point[1] -= 20;
                    points.push(point);
                  }
                }
                var style = api.style({
                  stroke: api.visual('color'),
                  fill: 'none'
                });
                return {
                  type: 'polyline',
                  shape: {
                    points: points
                  },
                  style: style
                };
              },
              itemStyle: {
                borderWidth: 2
              },
              encode: {
                x: 0,
                y: encodeY
              },
              data: customData,
              z: 100
            },
            ...dataList.map(function (data, index) {
              return {
                type: 'bar',
                animation: false,
                name: legendData[index + 1],
                itemStyle: {
                  opacity: 0.5
                },
                data: data
              };
            })
          ]
        };

        option && myChart.setOption(option);
      },
      initDate() {
        for (let i = 0; i < this.pieData.length; i++) {
          this.pieName[i] = this.pieData[i].name;
        }

      },
      /**
       * 饼图-样式
       */
      initEcharts() {
        // 饼图
        const option = {
          legend: {
            // 图例
            data: this.pieName,
            // right: "10%",
            // top: "30%",
            // orient: "top"
          },
          title: {
            // 设置饼图标题，位置设为顶部居中
            // text: "国内院士前五省份图示",
            // top: "0%",

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
            // text: 'Stacked Line'
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
      },
    },
  };

</script>

<style scoped lang="scss">
  .home {
    display: flex;
    flex-wrap: wrap;

    blockquote {
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 17.5px;
      border-left: 5px solid #eee;
    }

    .chart {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 40px;

      .pieChart {
        margin-left: 40px;
      }

      .linBarChart {
        margin-right: 40px;
      }
    }

    .lineChart {
      width: 100%;
      display: flex;
      justify-content: center;

      /* 水平居中 */
      .line-container {
        margin-left: 40px;
        margin-right: 40px
      }
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
