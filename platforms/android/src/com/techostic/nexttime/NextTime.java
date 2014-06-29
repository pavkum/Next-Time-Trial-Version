/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.techostic.nexttime;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

public class NextTime extends CordovaActivity {
	private final SimpleDateFormat formatter = new SimpleDateFormat(
			"yyyy-MM-dd");
	private final long ONE_DAY = 24 * 60 * 60 * 1000;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.init();
		// Set by <content src="index.html" /> in config.xml

		/*
		 * Intent i = new Intent(getApplicationContext(),
		 * PhoneCallMonitorService.class);
		 * getApplicationContext().startService(i);
		 */

		boolean trialExpired = true;
		// expire initially :P

		SharedPreferences preferences = getPreferences(MODE_PRIVATE);
		String installDate = preferences.getString("InstallDate", null);
		if (installDate == null) {
			// First run, so save the current date
			SharedPreferences.Editor editor = preferences.edit();
			Date now = new Date();
			String dateString = formatter.format(now);
			editor.putString("InstallDate", dateString);
			// Commit the edits!
			editor.commit();

			installDate = dateString;
		}

		// This is not the 1st run, check install date
		Date before = null;
		try {
			before = (Date) formatter.parse(installDate);

			Date now = new Date();
			long diff = now.getTime() - before.getTime();
			long days = diff / ONE_DAY;
			if (days < 3) { // Less than 3 days?
				trialExpired = false;
			}

		} catch (ParseException e) {
			Log.e("trial install date", e.getMessage());
		}

		super.loadUrl(Config.getStartUrl() + "#" + trialExpired);

	}
}
