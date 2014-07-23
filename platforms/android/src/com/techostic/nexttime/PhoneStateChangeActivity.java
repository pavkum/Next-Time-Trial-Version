package com.techostic.nexttime;

import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.techostic.nexttime.modal.Contact;
import com.techostic.nexttime.modal.Remainder;
import com.techostic.nexttime.storage.StorageAPI;
import com.techostic.nexttime.storage.StorageAPIImpl;

public class PhoneStateChangeActivity extends BroadcastReceiver{

	private static StorageAPI storageAPIImpl = null;
	
	private Intent dialerIntent = null;
	
	private List<Remainder> remainderList = null;
	
	private byte remaindedUsing = -1; // 0 incoming, 1 outgoing
	
	@Override
	public void onReceive(final Context context, final Intent intent) {
		
		if(storageAPIImpl == null){
			storageAPIImpl = StorageAPIImpl.getInstance(context);
		}
		
		TelephonyManager telephony = (TelephonyManager)context.getSystemService(Context.TELEPHONY_SERVICE);
        telephony.listen(new PhoneStateListener(){
            @Override
            public void onCallStateChanged(int state, String incomingNumber) {
                super.onCallStateChanged(state, incomingNumber);
                
                switch (state) {
    			case TelephonyManager.CALL_STATE_OFFHOOK:
    				
    				Bundle bundle = intent.getExtras();
    				
    				if(bundle == null){
    					Log.d("preeee bundle", "nulll bundle");
    					return;
    				}
    				
    				Log.d("bundleeeeeee", bundle.toString());
    				
    				if(intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER) == null){
    					Log.e("outgoing number", "null :(");
    					return;
    				}
    				
    				//Log.d("callll state offfff hooooookkkkk", intent.getExtras().getString(Intent.EXTRA_PHONE_NUMBER));
    				Log.d("callll state offfff hooooookkkkk", intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER));
    				
    				showDialer(context , intent.getExtras().getString(Intent.EXTRA_PHONE_NUMBER) , (byte)1);
    				
    				/*if (intent.getAction().equals(Intent)) {
    					
    				}*/
    				
    				break;

    			case TelephonyManager.CALL_STATE_RINGING:
    				
    				showDialer(context , incomingNumber ,  (byte)0);
    				break;
    				
    			case TelephonyManager.CALL_STATE_IDLE :
    				hideDialer(context);
    			}
            }
        },PhoneStateListener.LISTEN_CALL_STATE);
	}
	
	private void hideDialer(Context context) {
		
		if(this.dialerIntent != null){
			this.dialerIntent.putExtra("finish", "finish");
			
			// temporary solution
			DialerActivity dialerActivity = DialerActivity.getInstance();
			
			if(dialerActivity != null){
				dialerActivity.finish();
			}
			
			this.dialerIntent = null;
			
			for(int i=0; i<this.remainderList.size(); i++){
				Remainder remainder = remainderList.get(i);
				
				remainder.setRemainded(true);
				remainder.setRemaindedOn(new Date().getTime());
				remainder.setRemaindedUsing(this.remaindedUsing);
				
				//storageAPIImpl.updateRemainder(remainder);
				
			}
			
			this.remainderList = null;
			this.remaindedUsing = -1;
			
			
		}
	}
	
	private void showDialer (final Context context , String incomingNumber , final byte remaindedUsing){
		
		String un = incomingNumber;
		incomingNumber = incomingNumber.replaceAll("\\D", "");
		Pattern p = Pattern.compile("\\d{10}$");
		Matcher m = p.matcher(incomingNumber);
		incomingNumber = ((m.find()) ? m.group() : incomingNumber);
		
		final Long contactID = storageAPIImpl.getContactIDByPhoneNumber(incomingNumber);
		// check only for ID - performance as we expect 99% calls wouldn't be having any remainders
		
		Log.d("call", "numb : "+incomingNumber + " : contactid : "+contactID);
		
		if(contactID != null && contactID != -1){
			
	        
			Contact contact = storageAPIImpl.getContactById(contactID);
			
			remainderList = storageAPIImpl.getAllPendingRemaindersByContactID(contact.getContactID());
			
			
			
			if(remainderList == null || (remainderList != null && remainderList.size() == 0)){ // no pending remainders
				return;
			}
			
			Log.d("phonestate",remainderList+"");
			
			contact.setRemainders(remainderList);
			
			final JSONObject jsonObject = new JSONObject();
			
			try {
				jsonObject.put("contactID", contact.getContactID());
				jsonObject.put("name", contact.getFullName());
				jsonObject.put("photo", contact.getPhotoURL());
				
				JSONArray jsonMessageArray = new JSONArray();
				
				for(int i=0; i<remainderList.size(); i++){
					JSONObject jsonData = new JSONObject();
					
					jsonData.put("id", remainderList.get(i).getRemainderID());
					jsonData.put("message", remainderList.get(i).getRemainderMessage());
					//jsonData.put("message", un + "---"+incomingNumber + ":"+ contact.getContactID());
					jsonMessageArray.put(jsonData);
				}
				
				jsonObject.put("remainders", jsonMessageArray);
				
			} catch (JSONException e) {
				Log.d("Dialer Activity", "An error occured while displaying remainder for contact ID : "+contactID + " : " + e.getMessage());
				return;
			}
			
			Log.d("fineeeee", "tilll here");
			
			/*dialerIntent = new Intent(context, DialerActivity.class); 
			
			dialerIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			dialerIntent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
			dialerIntent.putExtra("contactID", contactID);
			dialerIntent.putExtra("json", jsonObject.toString());
			dialerIntent.putExtra("remaindedUsing", remaindedUsing);
			
			context.startActivity(dialerIntent);*/
			
			new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
			//new Timer().schedule(new TimerTask() {
				@Override
				public void run() {
					
					Log.d("postdelayed","heerrreee");
					
					dialerIntent = new Intent(context, DialerActivity.class); 
					
					dialerIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
					dialerIntent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
					dialerIntent.putExtra("contactID", contactID);
					dialerIntent.putExtra("json", jsonObject.toString());
					dialerIntent.putExtra("remaindedUsing", remaindedUsing);
					
					context.startActivity(dialerIntent);
				}
			}, 1000);
			
	        
		}
		
        
	}

}
