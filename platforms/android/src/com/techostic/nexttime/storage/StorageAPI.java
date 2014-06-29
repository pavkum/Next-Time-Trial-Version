package com.techostic.nexttime.storage;

import java.util.List;

import com.techostic.nexttime.modal.Contact;
import com.techostic.nexttime.modal.Remainder;
import com.techostic.nexttime.modal.Settings;

public interface StorageAPI {
	
	public boolean addContact(Contact contact);

	public List<Contact> getAllContacts();
	
	public Long getContactIDByPhoneNumber(String phoneNumber);
	
	public Contact getContactById(long contactID);
	
	public List<Remainder> getAllRemaindersByContactID(long contactID);
	
	public List<Remainder> getAllPendingRemaindersByContactID(long contactID);
	
	public boolean addRemainder(Remainder remainder);
	
	public Remainder getRemainderByID(long remainderID);
	
	public boolean deleteRemainder(List<Long> remainderIDs);
	
	public boolean updateRemainder(Remainder remainder);
	
	public boolean deleteAllRecordsOfContactById(List<Long> contactIDs);
	
	public List<Settings> getAllSettings();

	public boolean updateSettings(Settings settings);
	
	public Settings getSettingsBySettingsName(String name);

}
