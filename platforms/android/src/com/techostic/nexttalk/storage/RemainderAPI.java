package com.techostic.nexttalk.storage;

import java.util.List;

import com.techostic.nexttalk.modal.Remainder;

public interface RemainderAPI {

	public List<Remainder> getAllRemaindersByID(long userID);
	
	public boolean addRemainder(Remainder remainder);
	
	public boolean updateRemainder(Remainder remainder);
	
	public boolean deleteRemainder(List<Long> remainderIDs);
	
	public boolean deleteRemainderByContactId(long contactID);
	
	public List<Remainder> getAllPendingRemaindersByContactID(long contactID , String showAll);
} 
