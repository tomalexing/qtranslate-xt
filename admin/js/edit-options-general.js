/*
Loaded for /wp-admin/options-general.php
*/
new qTranslateX({
	addContentHooks: function(qtx)
	{
		var forms=document.getElementsByTagName('FORM');
		if(!forms.length) return false;
		var form=forms[0];

		qtx.addContentHookById('blogname',form,'[');
		qtx.addContentHookById('blogdescription',form,'[');

		return true;
	}
});