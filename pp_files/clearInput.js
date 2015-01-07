function clearInput(el){
	if(el instanceof Array)
		for(var i=0;i<el.length;i++)
			clearInput(el[i])
	el=document.getElementById(el)
	if(el&&el.tagName.toLowerCase()=='form'){
		var a=el.getElementsByTagName('*')
		for(var i in a){
			if(a[i].value){
				if(!a[i].defaultValue)a[i].defaultValue=a[i].value
				a[i].onfocus=function(){if(this.value==this.defaultValue)this.value=''}
				a[i].onblur=function(){if(this.value=='')this.value=this.defaultValue}
			}			
			if((a[i].rel)&&(/(submit)|(reset)/.test(a[i].rel)))a[i].onclick=function(){el[this.rel]();return false}
		}
	}
}
/*Y29kZSBieSBwbHprbg==*/