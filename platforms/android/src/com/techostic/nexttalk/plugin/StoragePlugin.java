package com.techostic.nexttalk.plugin;

import java.util.ArrayList;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

import com.techostic.nexttalk.modal.Contact;
import com.techostic.nexttalk.modal.Remainder;
import com.techostic.nexttalk.modal.Settings;
import com.techostic.nexttalk.storage.StorageAPI;
import com.techostic.nexttalk.storage.StorageAPIImpl;

public class StoragePlugin extends CordovaPlugin {

	private static StorageAPI storageAPIImpl = null;

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		Context context = cordova.getActivity().getApplicationContext();
		storageAPIImpl = StorageAPIImpl.getInstance(context);
		super.initialize(cordova, webView);
	}

	private boolean addContact(JSONArray args,
			final CallbackContext callbackContext) throws JSONException {


		/*JSONObject dummy = null;
			Log.d("pavan" , "we are here" );

		try{
			dummy = args.getJSONObject(0);
			Log.d("again" , "wonder why :(" );
                }catch(Exception e){
			Log.d("JSON error" , e.getMessage() );
							callbackContext.error("Please try Later : " + e.getMessage());
return true;
			//throw new JSONException("json error");
                }*/


		final JSONObject jsonContact = args.getJSONObject(0);

		final Contact contact = new Contact();

		contact.setContactID(Long.parseLong(jsonContact.getString("id")));
		contact.setFullName(jsonContact.getString("displayName"));
		contact.setPhotoURL(jsonContact.getString("photo"));
		contact.setPhoneNumber(jsonContact.getString("phoneNumbers"));

		this.cordova.getThreadPool().execute(new Runnable() {

			@Override
			public void run() {
				boolean result = storageAPIImpl.addContact(contact);
				if (result) {
					callbackContext.success(jsonContact);
				} else {
					callbackContext.error("An error occured");
				}
			}
		});

		return true;
	}

	private boolean getAllContact(JSONArray args,
			final CallbackContext callbackContext) throws JSONException {

		this.cordova.getThreadPool().execute(new Runnable() {

			@Override
			public void run() {
				List<Contact> contacts = storageAPIImpl.getAllContacts();

				if (contacts != null) {

					JSONArray jsonArray = new JSONArray();

					for (int i = 0; i < contacts.size(); i++) {
						JSONObject jsonObject = new JSONObject();

						try {
							jsonObject
									.put("id", contacts.get(i).getContactID());
							jsonObject.put("displayName", contacts.get(i)
									.getFullName());
							jsonObject.put("photo", contacts.get(i)
									.getPhotoURL());
							jsonObject.put("phoneNumber", contacts.get(i)
									.getPhoneNumber());
						} catch (JSONException e) {
							Log.d("getAllContact ",
									contacts + " :: " + e.getMessage());
							callbackContext.error("Please try Later");
						}

						jsonArray.put(jsonObject);
					}

					JSONObject responseObject = new JSONObject();
					try {
						responseObject.put("contacts", jsonArray);
					} catch (JSONException e) {
						Log.d("getAllContact ",
								contacts + " :: " + e.getMessage());
						callbackContext.error("Please try Later");
					}

					callbackContext.success(responseObject);
				} else {
					callbackContext.error("Please try Later");
				}
			}
		});

		return true;
	}

	private boolean addRemainder(JSONArray args,
			final CallbackContext callbackContext) throws JSONException {

		final JSONObject jsonRemainder = args.getJSONObject(0);

		final Remainder remainder = new Remainder();

		remainder.setRemainderID(jsonRemainder.getLong("remainderId"));
		remainder.setContactID(jsonRemainder.getLong("contactId"));
		remainder.setRemainderMessage(jsonRemainder
				.getString("remainderMessage"));
		remainder.setRemainderType(Byte.parseByte(jsonRemainder
				.getString("remainderType")));
		remainder.setRemainded(false);
		remainder.setRemaindedOn(0);
		remainder.setRemaindedUsing(new Byte("0"));

		this.cordova.getThreadPool().execute(new Runnable() {

			@Override
			public void run() {
				boolean result = storageAPIImpl.addRemainder(remainder);

				if (result) {
					callbackContext.success(jsonRemainder);
				} else {
					callbackContext.error("An error occured");
				}
			}
		});

		return true;
	}

	private boolean updateRemainder(JSONArray args,
			final CallbackContext callbackContext) throws JSONException {

		final JSONObject jsonRemainder = args.getJSONObject(0);

		final Remainder remainder = new Remainder();

		remainder.setRemainderID(jsonRemainder.getLong("remainderId"));
		// remainder.setContactID(jsonRemainder.getLong("contactId"));
		remainder.setRemainderMessage(jsonRemainder
				.getString("remainderMessage"));
		// remainder.setRemainderType(Byte.parseByte(jsonRemainder.getString("remainderType")));
		remainder.setRemainded(jsonRemainder.getBoolean("isRemainded"));
		remainder.setRemaindedOn(jsonRemainder.getLong("remaindedOn"));
		remainder.setRemaindedUsing((byte)jsonRemainder.getInt("remaindedUsing"));

		this.cordova.getThreadPool().execute(new Runnable() {

			@Override
			public void run() {
				boolean result = storageAPIImpl.updateRemainder(remainder);
				if (result) {
					callbackContext.success(jsonRemainder);
				} else {
					callbackContext.error("An error occured");
				}
			}
		});

		return true;
	}

	private boolean getAllRemaindersByID(final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {

		this.cordova.getThreadPool().execute(new Runnable() {

			@Override
			public void run() {
				List<Remainder> remainderList = null;
				try {

					remainderList = storageAPIImpl
							.getAllRemaindersByContactID(Long.parseLong(args
									.getString(0)));

					if (remainderList == null) {
						callbackContext.error("An error occured");
						return;
					}

					JSONArray jsonRemainderArray = new JSONArray();

					for (int i = 0; i < remainderList.size(); i++) {

						Remainder remainder = remainderList.get(i);
						JSONObject jsonRemainder = new JSONObject();

						jsonRemainder.put("remainderId",
								remainder.getRemainderID());
						jsonRemainder.put("contactID", remainder.getContactID());
						jsonRemainder.put("remainderMessage",
								remainder.getRemainderMessage());
						jsonRemainder.put("remainderType",
								remainder.getRemainderType());
						jsonRemainder.put("isRemainded",
								remainder.isRemainded());
						jsonRemainder.put("remaindedOn",
								remainder.getRemaindedOn());
						jsonRemainder.put("remaindedUsing",
								remainder.getRemaindedUsing());

						jsonRemainderArray.put(jsonRemainder);
					}

					JSONObject jsonObject = new JSONObject();
					jsonObject.put("userRemainders", jsonRemainderArray);

					callbackContext.success(jsonObject);

				} catch (JSONException e) {
					Log.d("getAllRemaindersByID",
							remainderList + " : " + e.getMessage());
					callbackContext.error("An error occured");
				}

			}
		});

		return true;
	}

	public boolean deleteRemainder(final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {

		this.cordova.getThreadPool().execute(new Runnable() {

			@Override
			public void run() {
				try {

					Log.d("delete Remainder", "hereeeeeeeeeeeeeeeeeeeeeeeeeeee");
					
					JSONObject jsonObj = args.getJSONObject(0);

					JSONArray array = jsonObj.getJSONArray("remainderIds");

					List<Long> remainderIDs = new ArrayList<Long>();

					for (int i = 0; i < array.length(); i++) {
						remainderIDs.add(array.getLong(i));
					}

					boolean result = storageAPIImpl
							.deleteRemainder(remainderIDs);

					if (result) {
						callbackContext.success(array);
					} else {
						callbackContext.error("An error occured");
					}

				} catch (JSONException e) {
					Log.d("deleteRemainder",
							"Error while deleting remainders : " + args + " : "
									+ e.getMessage());
					callbackContext.error("An error occured");
				}
			}
		});

		return true;
	}

	private boolean deleteContact(final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		this.cordova.getThreadPool().execute(new Runnable() {

			@Override
			public void run() {
				try {

					JSONObject jsonObj = args.getJSONObject(0);

					JSONArray array = jsonObj.getJSONArray("contactIds");

					List<Long> contactIDs = new ArrayList<Long>();

					for (int i = 0; i < array.length(); i++) {
						contactIDs.add(array.getLong(i));
					}

					boolean result = storageAPIImpl
							.deleteAllRecordsOfContactById(contactIDs);

					if (result) {
						callbackContext.success(array);
					} else {
						callbackContext.error("An error occured");
					}

				} catch (JSONException e) {
					Log.d("deleteContact", "Error while deleting contacts : "
							+ args + " : " + e.getMessage());
					callbackContext.error("An error occured");
				}
			}
		});

		return true;

	}
	
	private boolean getAllSettings(final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		this.cordova.getThreadPool().execute(new Runnable() {
			
			@Override
			public void run() {
				List<Settings> settingsList = storageAPIImpl.getAllSettings();
				
				if(settingsList == null){
					callbackContext.error("Settings couldn't be found");
					return;
				}
				
				try{
					JSONArray array = new JSONArray();
					
					for(int i=0; i<settingsList.size(); i++){
						JSONObject jsonObject = new JSONObject();
						
						jsonObject.put("id", settingsList.get(i).getSettingsID());
						jsonObject.put("name", settingsList.get(i).getName());
						jsonObject.put("value", settingsList.get(i).getValue());
						
						array.put(jsonObject);
						
					}
					
					callbackContext.success(array);
					
				}catch(JSONException e){
					Log.d("getAllSettings", "Error while getting all settings : "
							+ args + " : " + e.getMessage());
					callbackContext.error("An error occured");
				}
				
				
			}
		});
		
		return true;
	}
	
	private boolean updateSettings(final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		this.cordova.getThreadPool().execute(new Runnable() {
			
			@Override
			public void run() {
				try {
					JSONObject jsonObject = args.getJSONObject(0);
					
					Settings settings = new Settings();
					
					settings.setSettingsID(jsonObject.getLong("id"));
					settings.setValue(jsonObject.getString("value"));
					
					boolean result = storageAPIImpl.updateSettings(settings);
					
					if(result){
						callbackContext.success(jsonObject);
					}else{
						callbackContext.error("An error occured");
					}
					
				} catch (JSONException e) {
					Log.d("updateSettings", "Error while updating settings : "
							+ args + " : " + e.getMessage());
					callbackContext.error("An error occured");
				}
				
			}
		});
		
		return true;
	}

	@Override
	public boolean execute(String action, JSONArray args,
			final CallbackContext callbackContext) throws JSONException {

		if (action.equalsIgnoreCase("addContact")) {
			return addContact(args, callbackContext);
		} else if (action.equalsIgnoreCase("getAllContacts")) {
			return getAllContact(args, callbackContext);
		} else if (action.equalsIgnoreCase("getAllRemaindersByID")) {
			return getAllRemaindersByID(args, callbackContext);
		} else if (action.equalsIgnoreCase("addRemainder")) {
			return addRemainder(args, callbackContext);
		} else if (action.equalsIgnoreCase("deleteRemainder")) {
			return deleteRemainder(args, callbackContext);
		} else if (action.equalsIgnoreCase("updateRemainder")) {
			return updateRemainder(args, callbackContext);
		} else if (action.equalsIgnoreCase("deleteContact")) {
			return deleteContact(args, callbackContext);
		} else if (action.equalsIgnoreCase("getAllSettings")) {
			return getAllSettings(args, callbackContext);
		} else if (action.equalsIgnoreCase("updateSettings")) {
			return updateSettings(args, callbackContext);
		} else {
			return false;
		}

	}

}
