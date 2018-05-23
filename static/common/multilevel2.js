/**
 * 使用说明
 * var param={
			data:subjectList,	//处理的数据（必选）数据格式：[{object Object},{object Object}] 
			showId:'levelId',//显示的数据标签ID（必选）
			idKey:'subjectId',//数据的ID（必选）
			pidKey:'parentId',//数据的父ID（必选）
			nameKey:'subjectName',//数据显示的名（必选）
			returnElement:'returnId',//返回选中的值（必选 ）
			//-----------------------------------------------------
			returnIds:'returnIds',//返回所有级的ID，以“,”隔开（可选）
			initVal:209,//初始默认ID（可选）
			defName:'请选择',//默认显示的选项名（可选，如果不设置默认显示“请选择”）
			defValue:'0'//默认的选项值（可选，如果不设置默认是“0”）
		};
	ML._init(param);
 */
(function(window,undefined){
	//父级链
	var parentNodes=new Array(),prevArr;
	window.ML2 ={
			_init2:initMl
	};
	/**
	 * 初始化数据
	 */
	function initMl(params2){
		window.params2=params2;
		if(!params2.defName || params2.defName.replace(/ /g,'').replace(/　/g,'')==''){
			params2.defName='请选择';
		}
		if(!params2.defValue || !(/^\d+$/.test(params2.defValue))){
			params2.defValue=0;
		}
		if(params2.initVal && params2.initVal>0){
			showmlMultilevel();
		}else{
			showRoot();
		}
	}
	/**
	 * 显示多级
	 */
	function showmlMultilevel(){
		var nodes = params2.data;
		//得到初始化节点
		var node = getItself(params2.initVal,nodes);
		if(node==null){
			showRoot();
			return false;
		}
		//得到初始化节点的父节点链
		parentLinkList(node,nodes);
		if(parentNodes.length>0){
			for(var i=0;i<parentNodes.length;i++){
				if(i==0){
					showRoot();
				}else{
					var arr = sameLevel(parentNodes[i],nodes);
					//创建select元素
					createSelect(arr);
				}
			}
			childList(params2.initVal);
		}
	}
	
	/**
	 * 只显示根级节点
	 */
	function showRoot(){
		var rootArr = new Array();
		for(var i=0;i<params2.data.length;i++){
			var _index=0;
			for(var j=0;j<params2.data.length;j++){
				if(params2.data[i][params2.pidKey]==params2.data[j][params2.idKey])
				_index=1;
			}
			if(_index==0){
				rootArr.push(params2.data[i]);
			}
		}
		//创建select元素
		createSelect(rootArr);
	}
	
	/**
	 * 获取初始化节点
	 */
	function getItself(initVal,nodes){
		for(var i=0;i<nodes.length;i++){
			if(initVal==nodes[i][params2.idKey]){
				return nodes[i];
			}
		}
	}
	
	/**
	 * 获取父级链
	 */
	function parentLinkList(node,nodes){
		parentNodes.splice(0,0,node);
		for(var i=0;i<nodes.length;i++){
			if(node[params2.pidKey]==nodes[i][params2.idKey]){
				parentLinkList(nodes[i],nodes);
			}
		}
		
	}
	
	/**
	 * 获取同级节点
	 */
	function sameLevel(node,nodes){
		var sameArr =new Array();
		for(var i=0;i<nodes.length;i++){
			if(node[params2.pidKey]==nodes[i][params2.pidKey]){
				sameArr.push(nodes[i]);
			}
		}
		return sameArr;
	}
	
	/**
	 * 创建select元素
	 */
	function createSelect(arr){
		if(arr!=null && arr.length>0){
			var select = document.createElement('select');
			var option = document.createElement('option');
			option.setAttribute('value',params2.defValue);
			var text = document.createTextNode(params2.defName);
			option.appendChild(text);
			select.appendChild(option);
			for(var i=0;i<arr.length;i++){
				option = document.createElement('option');
				option.setAttribute('value',arr[i][params2.idKey]);
				selected(option,arr[i]);
				text = document.createTextNode(arr[i][params2.nameKey]);
				option.appendChild(text);
				select.appendChild(option);
			}
			var elem = document.getElementById(params2.showId);
			elem.appendChild(select);
			select.onchange = changeSelect;
		}
	}
	/**
	 * 设置选中项
	 */
	function selected(option,node){
		if(parentNodes.length>0){
			for(var i=0;i<parentNodes.length;i++){
				if(node[params2.idKey]==parentNodes[i][params2.idKey]){
					option.setAttribute('selected','selected');
					break;
				}
			}
		}
	}
	/**
	 * 当选择时调用
	 */
	function changeSelect(){
		if(this.nextSibling){
			deleteNext(this.nextSibling);
		}
		prevArr =new Array();
		//获取同级前面的元素
		prevNodes(this);
		if(this.value>params2.defValue){
			childList(this.value);
			document.getElementById(params2.returnElement).value=this.value;
		}else{
			if(prevArr.length>0){
				if(prevArr.length>=2){
					document.getElementById(params2.returnElement).value=prevArr[prevArr.length-2].value;
				}else{
					document.getElementById(params2.returnElement).value=prevArr[prevArr.length-1].value;
				}
			}
		}
		if(params2.returnIds){
			var ids='';
			for(var i=0;i<prevArr.length;i++){
				if(prevArr[i].value>params2.defValue){
					ids+=prevArr[i].value+',';
				}
			}
			if(ids!=''){
				document.getElementById(params2.returnIds).value=','+ids;
			}else{
				document.getElementById(params2.returnIds).value='';
			}
			
		}
	}
	/**
	 * 获取子级节点
	 */
	function childList(thisVal){
		var childArr = new Array();
		var _data = params2.data;
		for(var i=0;i<_data.length;i++){
			if(thisVal==_data[i][params2.pidKey]){
				childArr.push(_data[i]);
			}
		}
		createSelect(childArr);
	}
	/**
	 * 删除当前选择的select后所所有的元素
	 */
	function deleteNext(em){
		if(em.nextSibling){
			deleteNext(em.nextSibling);
		}
		document.getElementById(params2.showId).removeChild(em);
	}
	
	/**
	 * 获取前面的元素
	 */
	function prevNodes(em){
		if(em.previousSibling){
			prevNodes(em.previousSibling);
		}
		prevArr.push(em);
	}
})(window);
