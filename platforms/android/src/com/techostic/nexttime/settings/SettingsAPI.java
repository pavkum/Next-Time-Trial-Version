package com.techostic.nexttime.settings;

import java.util.List;

import com.techostic.nexttime.modal.Settings;


public interface SettingsAPI {

	public List<Settings> getAllSettings();

	public boolean updateSettings(Settings settings);
	
	public Settings getSettingsBySettingsName(String name);
}
