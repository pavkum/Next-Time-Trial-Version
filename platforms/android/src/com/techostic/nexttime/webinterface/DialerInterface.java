package com.techostic.nexttime.webinterface;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.techostic.nexttime.modal.Remainder;
import com.techostic.nexttime.storage.StorageAPI;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

public class DialerInterface {

	private Context context;

	private StorageAPI storageAPIImpl = null;

	private String autoRemove;
	
	private String autoRead;

	private byte remaindedUsing;

	public DialerInterface(Context context, StorageAPI storageAPIImpl,
			String autoRemove, String autoRead, byte remaindedUsing) {
		this.context = context;
		this.storageAPIImpl = storageAPIImpl;
		this.autoRemove = autoRemove;
		this.autoRead = autoRead;
		this.remaindedUsing = remaindedUsing;
		
		Log.d("dialeractivity", "autoremoveeee : "+this.autoRemove);
	}

	@JavascriptInterface
	public void getUserProfile(String contactID) {

	}

	@JavascriptInterface
	public void markSelectedRead(String remainderIds) {

		if (remainderIds != null) {
			try {
				JSONArray array = new JSONArray(remainderIds);
				
				if(autoRemove.equals("1")){
					
					List<Long> remainderIdList = new ArrayList<Long>();
					
					for(int i=0; i<array.length(); i++){
						JSONObject jsonRemainder = array.getJSONObject(i);
						remainderIdList.add(jsonRemainder.getLong("id"));
					}
					
					storageAPIImpl.deleteRemainder(remainderIdList);
					
				}else{
					for(int i=0; i<array.length(); i++){
						JSONObject jsonRemainder = array.getJSONObject(i);
						
						Remainder remainder = new Remainder();
						
						remainder.setRemainderID(jsonRemainder.getLong("id"));
						remainder.setRemainderMessage(jsonRemainder.getString("message"));
						
						remainder.setRemainded(true);
						remainder.setRemaindedOn(new Date().getTime());
						remainder.setRemaindedUsing(this.remaindedUsing);
						
						storageAPIImpl.updateRemainder(remainder);
					}
				}
				
			} catch (JSONException e) {
				Log.d("Dialer Interface : markSelectedRead",
						"An error occured while parsing json string of remainderIDs : "
								+ e.getMessage());
			}
		}

		//finish();
	}

	@JavascriptInterface
	public void finish(String remainderIds) {
		
		if(remainderIds != null && !remainderIds.isEmpty() && this.autoRead.equalsIgnoreCase("1")){

			JSONArray array;
			try {
				array = new JSONArray(remainderIds);
			
			
			for(int i=0; i<array.length(); i++){
				JSONObject jsonRemainder = array.getJSONObject(i);
				
				Remainder remainder = new Remainder();
				
				remainder.setRemainderID(jsonRemainder.getLong("id"));
				remainder.setRemainderMessage(jsonRemainder.getString("message"));
				
				remainder.setRemainded(true);
				remainder.setRemaindedOn(new Date().getTime());
				remainder.setRemaindedUsing(this.remaindedUsing);
				
				storageAPIImpl.updateRemainder(remainder);
			}
			
			} catch (JSONException e) {
				Log.d("Dialer Interface : finish",
						"An error occured while parsing json string of remainderIDs : "
								+ e.getMessage());
			}
		
		}
		
		((Activity) this.context).finish();
		
	}

}
