package com.kaasai; 

import android.database.Cursor;
import android.net.Uri;
import android.provider.Telephony;
import android.content.ContentResolver;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class SmsReaderModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public SmsReaderModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "SmsReader";
  }

  @ReactMethod
  public void readSMS(Promise promise) {
    WritableArray smsList = Arguments.createArray();
    ContentResolver cr = reactContext.getContentResolver();
    Cursor cursor = cr.query(Telephony.Sms.Inbox.CONTENT_URI, null, null, null, null);

    if (cursor != null && cursor.moveToFirst()) {
      do {
        WritableMap sms = Arguments.createMap();
        sms.putString("address", cursor.getString(cursor.getColumnIndex(Telephony.Sms.Inbox.ADDRESS)));
        sms.putString("body", cursor.getString(cursor.getColumnIndex(Telephony.Sms.Inbox.BODY)));
        sms.putString("date", cursor.getString(cursor.getColumnIndex(Telephony.Sms.Inbox.DATE)));
        smsList.pushMap(sms);
      } while (cursor.moveToNext());
      cursor.close();
    }

    promise.resolve(smsList);
  }
}
