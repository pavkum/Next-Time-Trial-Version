package com.techostic.nexttime;

import java.util.List;
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
import android.util.Log;

import com.techostic.nexttime.modal.Contact;
import com.techostic.nexttime.modal.Remainder;
import com.techostic.nexttime.storage.StorageAPI;

public class OutgoingCallListener extends BroadcastReceiver {

	private static StorageAPI storageAPIImpl = null;

	private Intent dialerIntent = null;

	private List<Remainder> remainderList = null;

	private byte remaindedUsing = -1; // 0 incoming, 1 outgoing

	@Override
	public void onReceive(Context context, Intent intent) {
		Bundle bundle = intent.getExtras();

		if (null == bundle)
			return;

		String phonenumber = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);

		Log.i("OutgoingCallReceiver", phonenumber);
		Log.i("OutgoingCallReceiver", bundle.toString());

		showDialer(context, phonenumber);

	}

	private void showDialer(final Context context, String incomingNumber) {

		String un = incomingNumber;
		incomingNumber = incomingNumber.replaceAll("\\D", "");
		Pattern p = Pattern.compile("\\d{10}$");
		Matcher m = p.matcher(incomingNumber);
		incomingNumber = ((m.find()) ? m.group() : incomingNumber);

		final Long contactID = storageAPIImpl
				.getContactIDByPhoneNumber(incomingNumber);
		// check only for ID - performance as we expect 99% calls wouldn't be
		// having any remainders

		Log.d("call", "numb : " + incomingNumber);

		if (contactID != null && contactID != -1) {

			Contact contact = storageAPIImpl.getContactById(contactID);

			remainderList = storageAPIImpl
					.getAllPendingRemaindersByContactID(contact.getContactID());

			if (remainderList == null
					|| (remainderList != null && remainderList.size() == 0)) { // no
																				// pending
																				// remainders
				return;
			}

			contact.setRemainders(remainderList);

			final JSONObject jsonObject = new JSONObject();

			try {
				jsonObject.put("contactID", contact.getContactID());
				jsonObject.put("name", contact.getFullName());
				jsonObject.put("photo", contact.getPhotoURL());

				JSONArray jsonMessageArray = new JSONArray();

				for (int i = 0; i < remainderList.size(); i++) {
					JSONObject jsonData = new JSONObject();

					jsonData.put("id", remainderList.get(i).getRemainderID());
					jsonData.put("message", remainderList.get(i)
							.getRemainderMessage());
					// jsonData.put("message", un + "---"+incomingNumber + ":"+
					// contact.getContactID());
					jsonMessageArray.put(jsonData);
				}

				jsonObject.put("remainders", jsonMessageArray);

			} catch (JSONException e) {
				Log.d("Dialer Activity",
						"An error occured while displaying remainder for contact ID : "
								+ contactID + " : " + e.getMessage());
				return;
			}

			new Handler().postDelayed(new Runnable() {

				@Override
				public void run() {
					dialerIntent = new Intent(context, DialerActivity.class);

					dialerIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
					dialerIntent
							.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
					dialerIntent.putExtra("contactID", contactID);
					dialerIntent.putExtra("json", jsonObject.toString());
					dialerIntent.putExtra("remaindedUsing", remaindedUsing);

					context.startActivity(dialerIntent);
				}
			}, 2000);

		}

	}

}
