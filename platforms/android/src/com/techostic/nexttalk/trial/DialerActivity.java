package com.techostic.nexttalk.trial;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.WindowManager.LayoutParams;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.techostic.nexttalk.modal.Settings;
import com.techostic.nexttalk.storage.StorageAPI;
import com.techostic.nexttalk.storage.StorageAPIImpl;
import com.techostic.nexttalk.webinterface.DialerInterface;

public class DialerActivity extends Activity {

	
	private static DialerActivity dialerActivity = null;
	
	private StorageAPI storageAPIImpl = null;
	
	public static DialerActivity getInstance() {
		return dialerActivity;
	}
	
	@SuppressLint("SetJavaScriptEnabled")
	@Override
	public void onCreate(Bundle savedInstanceState) {
		
		DialerActivity.dialerActivity = this;
		
		storageAPIImpl = StorageAPIImpl.getInstance(this);
		
		super.onCreate(savedInstanceState);
		
		this.getWindow().addFlags(LayoutParams.FLAG_NOT_TOUCH_MODAL);   
		this.getWindow().addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
		this.getWindow().addFlags(LayoutParams.FLAG_DISMISS_KEYGUARD);
		this.getWindow().addFlags(LayoutParams.FLAG_SHOW_WHEN_LOCKED);
		this.getWindow().addFlags(LayoutParams.FLAG_TURN_SCREEN_ON);
		this.getWindow().setFlags(LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH, LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH);  
		
		final WebView wv = new WebView(this);
		
		wv.setBackgroundColor(Color.TRANSPARENT);
		wv.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
		
		final Long contactID = this.getIntent().getLongExtra("contactID", -1l);
		
		if(contactID != -1){
			wv.loadUrl("file:///android_asset/www/dialer.html#" + contactID);
			
			wv.setBackgroundColor(Color.TRANSPARENT);
			wv.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
			
		}else{
			finish();
			return;
		}
		
		WebSettings webSettings = wv.getSettings();
		webSettings.setJavaScriptEnabled(true);
		
		Settings autoRemove = storageAPIImpl.getSettingsBySettingsName("autoRemove");
		
		
		String autoRemoveStatus = "0"; // dont delete by default
		
		
		if(autoRemove != null){ //no error while obtaining ;
			autoRemoveStatus = autoRemove.getValue();
		}
		
		Settings autoRead = storageAPIImpl.getSettingsBySettingsName("autoRead");
		
		String autoReadStatus = "0";
		
		if(autoRead != null){
			autoReadStatus = autoRead.getValue();
		}
		
		final String jsonData = this.getIntent().getStringExtra("json");
		
		wv.addJavascriptInterface(new DialerInterface(this , storageAPIImpl , autoRemoveStatus , autoReadStatus , this.getIntent().getByteExtra("remaindedUsing", (byte)-1)), "Android");
		
		wv.setWebViewClient(new WebViewClient() {
		    @Override
		    public boolean shouldOverrideUrlLoading(WebView view, String url) {
		        view.loadUrl(url);
		        return true;
		    }
		    
		    @Override
		    public void onPageFinished(WebView view, String url) {
		    	super.onPageFinished(view, url);
		    	
		    	Settings openClosed = storageAPIImpl.getSettingsBySettingsName("showCollapsed");
		    	
		    	String openClosedStatus = "0"; // expand by default
		    	
		    	if(openClosed != null){
					openClosedStatus = openClosed.getValue();
				}
		    	
		    	wv.loadUrl("javascript:displayData('" + jsonData + "' , " + openClosedStatus + ");");
		    }
		});
		
		

		this.setContentView(wv);
		this.getWindow().setGravity(Gravity.TOP);
		
	}
	
	
	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		if(intent.getStringExtra("finish") != null){
			finish();
		}
		
	}
	
	@Override
	protected void onDestroy() {
		DialerActivity.dialerActivity = null;
		super.onDestroy();
	}
	
	@Override
	public boolean onTouchEvent(MotionEvent event) {
		if(MotionEvent.ACTION_OUTSIDE == event.getAction()){
			return super.onTouchEvent(event);
		}
		return super.onTouchEvent(event);
	}

}
