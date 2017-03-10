/**
 * Created by zyj on 2017/1/30.
 */

var opts = {
    //innerImage: {url: '../img/logo.png', width: 56, height: 56 }, //内部图片
    lines: 13, // 花瓣数目
    length: 20, // 花瓣长度
    width: 10, // 花瓣宽度
    radius: 30, // 花瓣距中心半径
    corners: 1, // 花瓣圆滑度 (0-1)
    rotate: 0, // 花瓣旋转角度
    direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
    color: '#5882FA', // 花瓣颜色
    speed: 1, // 花瓣旋转速度
    trail: 60, // 花瓣旋转时的拖影(百分比)
    shadow: false, // 花瓣是否显示阴影
    hwaccel: false, //spinner 是否启用硬件加速及高速旋转
    className: 'spinner', // spinner css 样式名称
    zIndex: 2e9, // spinner的z轴 (默认是2000000000)
    top: 'auto', // spinner 相对父容器Top定位 单位 px
    left: 'auto', // spinner 相对父容器Left定位 单位 px
    position: 'relative', // element position
    progress: true,      // show progress tracker
    progressTop: 0,       // offset top for progress tracker
    progressLeft: 0       // offset left for progress tracker
};
var spinner = new Spinner(opts)

bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
    $('#alert_placeholder').html('<div id="myAlert" class="alert alert-warning"><a href="#" class="close" data-dismiss="alert">&times;</a>'+message+'</div>')
}
bootstrap_alert.success = function(message) {
    $('#alert_placeholder').html('<div id="myAlert" class="alert alert-success"><a href="#" class="close" data-dismiss="alert">&times;</a>'+message+'</div>')
}

//pod数据
var podData

var methodObj={
    getDate:function(data) {
        $.ajax({
            url: 'http://127.0.0.1:8080/api?m=pod_list&sid=1',
            data: data,
            type: 'GET',
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data) {
                console.log(data);
                podData = data['data']
                var templi = Handlebars.compile($("#templi").html());
                $('.tablelist').html(templi(data));
            },
            error: function () {
                console.log('接口有问题');
            }
        })
    }
};

function getMirrorSchedule(start){
    $.ajax({
        url: 'http://127.0.0.1:8080/api?m=start_schedule&sid=1',
        data: {'start':start},
        type: 'GET',
        dataType: "jsonp",
        jsonp: 'callback',
        success: function (data) {
            console.log(data);
            if (data['data'] == '1'){
                document.getElementById("schedule").value = "停止定时镜像";
            }else {
                document.getElementById("schedule").value = "定时镜像";
            }
        },
        error: function () {
            console.log('接口有问题');

        }
    })
}

//创建新的pod
function creatPod(podName,sourceHttpUrl,specSourceHttpUrl,mirrorSSHUrl,mirrorHttpUrl,noReplaceSource){

    $.ajax({
        url: 'http://127.0.0.1:8080/api?m=pod_add&sid=1',
        data: {'podName':podName,'sourceHttpUrl':sourceHttpUrl,'specSourceHttpUrl':specSourceHttpUrl,'mirrorSSHUrl':mirrorSSHUrl,'mirrorHttpUrl':sourceHttpUrl,'noReplaceSource':noReplaceSource},
        type: 'POST',
        dataType: "jsonp",
        jsonp: 'callback',
        success: function (data) {
            if (data['status'] != 0) {
                bootstrap_alert.warning(data['info']);
            }
            else {
                methodObj.getDate();
                $('#addModal').modal('hide');
                bootstrap_alert.success('创建成功');
                setTimeout(function(){$("#myAlert").alert('close')},3000);
            }
        },
        error: function () {
            console.log('接口有问题');
        }
    })
}

//更新pod
function updatePod(podName,sourceHttpUrl,specSourceHttpUrl,mirrorSSHUrl,mirrorHttpUrl,pid,noReplaceSource){

    $.ajax({
        url: 'http://127.0.0.1:8080/api?m=pod_update&sid=1',
        data: {'podName':podName,'sourceHttpUrl':sourceHttpUrl,'specSourceHttpUrl':specSourceHttpUrl,'mirrorSSHUrl':mirrorSSHUrl,'mirrorHttpUrl':mirrorHttpUrl,'pid':pid,'noReplaceSource':noReplaceSource},
        type: 'POST',
        dataType: "jsonp",
        jsonp: 'callback',
        success: function (data) {
            if (data['status'] != 0) {
                bootstrap_alert.warning(data['info']);
            }
            else {
                methodObj.getDate();
                $('#addModal').modal('hide');
                bootstrap_alert.success('更新成功');
                setTimeout(function(){$("#myAlert").alert('close')},3000);
            }
        },
        error: function () {
            console.log('接口有问题');
        }
    })
}

//删除pod
function deletePod(pid){
    $.ajax({
        url: 'http://127.0.0.1:8080/api?m=pod_delete&sid=1',
        data: {'pid':pid},
        type: 'POST',
        dataType: "jsonp",
        jsonp: 'callback',
        success: function (data) {
            if (data['status'] != 0) {
                bootstrap_alert.warning(data['info']);
            }
            else {
                methodObj.getDate();
                $('#deleteModal').modal('hide');
                bootstrap_alert.success('删除成功');
                setTimeout(function(){$("#myAlert").alert('close')},3000);
            }
        },
        error: function () {
            console.log('接口有问题');
        }
    })
}

function mirrorPod(pid){
    $.ajax({
        url: 'http://127.0.0.1:8080/api?m=pod_mirror&sid=1',
        data: {'pid':pid},
        type: 'POST',
        dataType: "jsonp",
        jsonp: 'callback',
        success: function (data) {
            spinner.spin();
            if (data['status'] != 0) {
                bootstrap_alert.warning(data['info']);
            }
            else {
                methodObj.getDate();
                bootstrap_alert.success('镜像成功');
                setTimeout(function(){$("#myAlert").alert('close')},3000);
            }
        },
        error: function () {
            spinner.spin();
            console.log('接口有问题');
        }
    })
}

function mirrorAll(){
    $.ajax({
        url: 'http://127.0.0.1:8080/api?m=pod_mirror_all&sid=1',
        data: {},
        type: 'POST',
        dataType: "jsonp",
        jsonp: 'callback',
        success: function (data) {
            spinner.spin();
            if (data['status'] != 0) {
                bootstrap_alert.warning(data['info']);
            }
            else {
                methodObj.getDate();
                bootstrap_alert.success('镜像成功');
                setTimeout(function(){$("#myAlert").alert('close')},3000);
            }
        },
        error: function () {
            spinner.spin();
            console.log('接口有问题');
        }
    })
}

//获取url里的参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}

function setModalElementByCheckBox(noReplaceSource){

    target1 = document.getElementById("form-sourceHttpUrl");
    target2 = document.getElementById("form-specSourceHttpUrl");
    target3 = document.getElementById("form-mirrorSSHUrl");
    target4 = document.getElementById("form-mirrorHttpUrl");
    if (noReplaceSource){

        target1.style.display="none";
        target2.style.display="none";
        target3.style.display="none";
        target4.style.display="none";
    }else {

        target1.style.display="block";
        target2.style.display="block";
        target3.style.display="block";
        target4.style.display="block";
    }
}

$(function(){
    var podInfo
    methodObj.getDate();
    getMirrorSchedule();

    $(document).on('click','.newfolder',function(){
        podInfo = null;
        $('#addModal').modal({
            keyboard: true
        })
    });
    $(document).on('click','.refresh',function(){
        var target = document.getElementById('container1');
        spinner.spin(target);
        mirrorAll();
    });

    $(document).on('click','.mirrorschedule',function(){
        if (document.getElementById("schedule").value == "停止定时镜像"){
            getMirrorSchedule(0);
        }else {
            getMirrorSchedule(1);
        }

    });

    //删除行
    $(document).on('click','.removeli',function(){
        var index = $(this).attr('data-index');
        podInfo = podData[index];
        $('#deleteModal').modal({
            keyboard: true
        })
    });

    //镜像
    $(document).on('click','.mirrorli',function(){
        var index = $(this).attr('data-index');
        podInfo = podData[index];
        mirrorPod(podInfo['pid']);
        var target = document.getElementById('container1');
        spinner.spin(target);
    });

    //编辑行
    $(document).on('click','.editli',function(){
        var index = $(this).attr('data-index');
        podInfo = podData[index];
        $('#addModal').modal({
            keyboard: true
        })
    });

    $(document).on('click','.checkfri',function(){

        var noReplace = document.getElementById("noReplaceSource").checked;
        setModalElementByCheckBox(noReplace);
    });

    //modal创建更新确认
    $(document).on('click','.creatconfri',function(){

        var noReplace = document.getElementById("noReplaceSource").checked;
        var sourceHttpUrl = document.getElementById("sourceHttpUrl").value;
        var specSourceHttpUrl = document.getElementById("specSourceHttpUrl").value;
        var mirrorSSHUrl = document.getElementById("mirrorSSHUrl").value;
        var mirrorHttpUrl = document.getElementById("mirrorHttpUrl").value;

        if (noReplace){
            noReplace = 1;
        }else {
            noReplace = 0;

            if (sourceHttpUrl == ""){
                document.getElementById("sourceHttpUrl-label").style.color="red";
                return;
            }else{
                document.getElementById("sourceHttpUrl-label").style.color="";
            }

            if (specSourceHttpUrl == ""){
                document.getElementById("specSourceHttpUrl-label").style.color="red";
                return;
            }else{
                document.getElementById("specSourceHttpUrl-label").style.color="";
            }

            if (mirrorSSHUrl == ""){
                document.getElementById("mirrorSSHUrl-label").style.color="red";
                return;
            }else{
                document.getElementById("mirrorSSHUrl-label").style.color="";
            }

            if (mirrorHttpUrl == ""){
                document.getElementById("mirrorHttpUrl-label").style.color="red";
                return;
            }else{
                document.getElementById("mirrorHttpUrl-label").style.color="";
            }
        }

        var podName = document.getElementById("pod-name").value;
        if (podName == ""){
            document.getElementById("pod-name-label").style.color="red";
            return;
        }else{
            document.getElementById("pod-name-label").style.color="";
        }

        var confirText = document.getElementById("confir").value;
        if (confirText == '创建') {
            console.log('创建');
            creatPod(podName,sourceHttpUrl,specSourceHttpUrl,mirrorSSHUrl,mirrorHttpUrl,noReplace);
        }else{
            console.log('修改');
            console.log('hhhhh');
            updatePod(podName,sourceHttpUrl,specSourceHttpUrl,mirrorSSHUrl,mirrorHttpUrl,podInfo['pid'],noReplace);
        }
    });

    //model删除确认
    $(document).on('click','.deleteconfir',function(){
        var pid = podInfo['pid'];
        deletePod(pid);
    })

    $('#addModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        if (podInfo == null){
            //创建
            modal.find('.modal-title').text('添加新Pod')
            modal.find('.pod-name').val('');
            modal.find('.sourceHttpUrl').val('');
            modal.find('.specSourceHttpUrl').val('');
            modal.find('.mirrorSSHUrl').val('');
            modal.find('.mirrorHttpUrl').val('');
            modal.find('.creatconfri').text('创建');
            modal.find('.creatconfri').val('创建');
            document.getElementById("noReplaceSource").checked = false;
        }else {
            //编辑
            modal.find('.modal-title').text('修改: ' + podInfo['podName'])
            modal.find('.pod-name').val(podInfo['podName']);
            modal.find('.sourceHttpUrl').val(podInfo['sourceHttpUrl']);
            modal.find('.specSourceHttpUrl').val(podInfo['specSourceHttpUrl']);
            modal.find('.mirrorSSHUrl').val(podInfo['mirrorSSHUrl']);
            modal.find('.mirrorHttpUrl').val(podInfo['mirrorHttpUrl']);
            modal.find('.creatconfri').text('修改');
            modal.find('.creatconfri').val('修改');
            var noreplace = podInfo['noReplaceSource'];
            if (noreplace == 1){
                document.getElementById("noReplaceSource").checked = true;
            }else{
                document.getElementById("noReplaceSource").checked = false;
            }
        }
        setModalElementByCheckBox(document.getElementById("noReplaceSource").checked);
    })
});