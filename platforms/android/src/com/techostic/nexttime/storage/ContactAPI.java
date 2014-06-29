package com.techostic.nexttime.storage;

import java.util.List;

import com.techostic.nexttime.modal.Contact;

public interface ContactAPI {

	public boolean addContact(Contact contact);

	public List<Contact> getAllContacts();

	public Long getContactIDByPhoneNumber(String phoneNumber);
	
	public Contact getContactById(long contactID);
	
	public boolean deleteContactById(List<Long> contactIDs);
}
