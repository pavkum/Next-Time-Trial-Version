package com.techostic.nexttalk.settings;

import java.util.List;

import com.techostic.nexttalk.modal.Settings;


public interface SettingsAPI {

	public List<Settings> getAllSettings();

	public boolean updateSettings(Settings settings);
	
	public Settings getSettingsBySettingsName(String name);
}
