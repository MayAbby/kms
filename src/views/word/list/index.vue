<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="98px">
      <el-form-item label="文档文件名称" prop="wordFilePath">
        <el-input v-model="queryParams.wordFilePath" placeholder="请输入文档文件名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文档类型" prop="wordType">
        <el-input v-model="queryParams.wordType" placeholder="请输入文档类型" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文档提交时间">
        <el-date-picker v-model="wordSubmitDate" style="width: 240px" value-format="yyyy-MM-dd" type="wordSubmitDate"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['word:post:add']">批量上传</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['word:post:add']">批量下载</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['word:post:update']">修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['word:post:delete']">批量删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:config:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-refresh" size="mini" @click="handleRefreshCache"
          v-hasPermi="['system:config:remove']">刷新缓存</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="wordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文档/文件名称" align="center" prop="wordFilePath" />
      <el-table-column label="文档类型" align="center" prop="wordType" :show-overflow-tooltip="true" />
      <el-table-column label="关联用户" align="center" prop="relationUser" :show-overflow-tooltip="true" />
      <el-table-column label="关联项目" align="center" prop="relationItem" />
      <el-table-column label="文件提交人" align="center" prop="relationItem" />
      <el-table-column label="关联项目" align="center" prop="wordSubmitUser" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="文档提交时间" align="center" prop="wordSubmitUser" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.wordSubmitUser) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['word:post:update']">预览</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['word:post:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['word:post:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 批量上传文件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="关联项目" prop="relationItem">
          <el-select v-model="form.relationItem" placeholder="请选择关联项目" clearable style="width: 240px">
            <el-option v-for="(item) in relations" :key="item.value" :label="item.itemPath" :value="item.itemPath" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目关联负责人" prop="itemLeadUser">
          <el-select v-model="form.itemLeadUser" placeholder="项目关联负责人" clearable style="width: 240px">
            <el-option v-for="item in userList" :key="item.value" :label="item.remark" :value="item.remark" />
          </el-select>
        </el-form-item>
        <el-form-item label="文档/文件上传" prop="listFile">
          <el-upload class="upload-demo" ref="upload" action="wordAdd" :on-change="onChangeFj"
            :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    wordList,
    wordAdd
  } from "@/api/word/word";
  import {
    projectAll
  } from "@/api/projrctList/list";
  import {
    listUser
  } from "@/api/system/user";
  export default {
    name: "file",
    dicts: ['pro_file'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 表单参数
        form: {},
        // 表格数据参数
        wordList: [],
        // 日期范围
        wordSubmitDate: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          wordFilePath: undefined, // 文档文件名称
          listFile: [], // 批量上传文档
          relationUser: [], //关联用户
          itemLeadUser: [], // 项目负责人
          relationItem: [], //关联项目
          wordType: [], //文档类型
        },
        // 显示搜索条件
        showSearch: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 获取所有关联项目
        relations: [],
        // 获取所有关联用户
        userList: [],
        fileList: []
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      /** 查询参数列表 */
      getList() {
        this.loading = true;
        wordList(this.addDateRange(this.queryParams, this.wordSubmitDate)).then(response => {
          this.wordList = response.data;
          // this.total = response.total;
          this.loading = false;
        });
      },
      /** 查询用户列表 */
      getUserList() {
        this.loading = true;
        listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 获取所有关联项目 */
      getProList() {
        this.loading = true;
        projectAll().then(response => {
          this.relations = response.data;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      // 表单重置
      reset() {
        this.form = {
          // wordType: undefined,
          listFile: []
        };
        this.resetForm("form");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.wordSubmitDate = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.getProList()
        this.getUserList()
        this.title = "添加参数";
      },
      submitForm() {
        this.open = false;
        // this.reset();
        this.submitUpload()
        this.queryParams
      },
      // 对话框取消按钮
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        console.log('row:', row)
        const wordIds = row.id || this.ids;
        this.$modal.confirm('是否确认删除文档/文件名称为"' + row.wordFilePath + '"的数据项？').then(function () {
          return delConfig(wordIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        console.log('selection:', selection)
        this.ids = selection.map(item => item.id)
        console.log('this.ids:', this.ids)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      //--------------------上传文件------------------
      //批量上传
      submitUpload() {
        this.$refs.wordAdd.submit();
        //接口
        this.from.listFile = this.fileList
        console.log('this.from:', this.from)
        wordAdd(this.from).then((res) => {
          console.log('from:', this.from)
          if (res.data.code == 200) {
            this.$message.success("附件上传成功！");
            // this.saveScfjArr = res.data.data;
            // this.saveSuccessId = "";
            this.$refs.wordAdd.clearFiles(); //清除上传文件
          }
        });
        console.log('--------------------')
      },
      //选择文件时候触发  需根据需求具体分析
      onChangeFj(file, fileList) {
        console.log('fileList:', fileList)
        //this.fileListArr = fileList;
        //this.gwModleObj.scfj = fileList;
        //this.$refs.gwModleObj.validateField("scfj");
        //this.saveSuccessId = 1;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  }

</script>
