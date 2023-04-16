package com.aspinax.lanaevents;

import static android.graphics.Color.BLACK;
import static android.graphics.Color.WHITE;
import static com.aspinax.lanaevents.UserDiscoverFragment.getTodayDate;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.google.android.material.button.MaterialButton;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FieldValue;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class ViewEventActivity extends AppCompatActivity {
    private Database db;
    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_event);

        Intent intent = getIntent();
        String eventId = intent.getStringExtra("eventId");
        String name = intent.getStringExtra("name");
        int attendeeCount = intent.getIntExtra("attendeeCount", 0);
        long end = intent.getLongExtra("end", 0);
        String location = intent.getStringExtra("location");
        String orgId = intent.getStringExtra("orgId");
        long start = intent.getLongExtra("start", 0);
        int type = intent.getIntExtra("type", 0);
        String image = intent.getStringExtra("image");
        int checkInCount = intent.getIntExtra("checkInCount", 0);
        String addedBy = intent.getStringExtra("addedBy");

        TextView rooms_id = findViewById(R.id.rooms_id);
        rooms_id.setText(location);

        Map<String , Double> coordinates = new HashMap<>();
        coordinates.put("longitude", intent.getDoubleExtra("longitude", 0));
        coordinates.put("latitude", intent.getDoubleExtra("latitude", 0));

        final Event event = new Event(addedBy, attendeeCount, checkInCount, new Timestamp(end, 0), image, location, name, orgId, true,  new Timestamp(start, 0), type, coordinates);
        event.setEventId(eventId);
        TextView eventNameView = findViewById(R.id.event_name);
        eventNameView.setText(event.name);
        TextView fromView = findViewById(R.id.from);
        SimpleDateFormat startDate = new SimpleDateFormat("dd MMMM yyyy", Locale.US);
        fromView.setText(startDate.format(event.start.toDate()));
        final TextView countView = findViewById(R.id.attendee_count);
        if (event.end.getSeconds() < getTodayDate().getTime()/1000L) countView.setText(event.attendeeCount + " went");
        countView.setText(event.attendeeCount + " going");

        ImageView backBtn = findViewById(R.id.back);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });



        final MaterialButton book = findViewById(R.id.book_btn);
        final FirebaseAuth mAuth = FirebaseAuth.getInstance();

        db = new Database(new AsyncResponse() {
            @SuppressLint("SetTextI18n")
            @Override
            public void resultHandler(Map<String, Object> result, int resultCode) {
                if (resultCode == 0) {
                    if (result.isEmpty()) {
                        book.setEnabled(true);
                        book.setOnClickListener(v -> {
                            if (event.end.getSeconds() < getTodayDate().getTime()/1000L) {
                                Toast.makeText(getApplicationContext(), "The deadline to book has passed", Toast.LENGTH_LONG).show();
                            } else {
                                Map<String, Object> data = new HashMap<>();
                                data.put("eventId", event.eventId);
                                data.put("userId", mAuth.getUid());
                                data.put("createdAt", FieldValue.serverTimestamp());
                                data.put("end", event.end);
                                book.setOnClickListener(null);
                                db.add("tickets", data, 1);
                            }
                        });
                    } else {

                        markAsBooked(book);
                        String ticketId = (String) result.keySet().toArray()[0];
                        Ticket t = (Ticket) result.get(ticketId);
                        assert t != null;
                        book.setEnabled(true);
                        t.setTicketId(ticketId);
                        TextView ticketIdView = findViewById(R.id.ticketId);
                        ticketIdView.setText("# " + t.ticketId);
                        TextView hereView = findViewById(R.id.here_your);
                        hereView.setVisibility(View.VISIBLE);
                        LinearLayout ticketGroupView = findViewById(R.id.ticket_group);
                        ticketGroupView.setVisibility(View.VISIBLE);
                        ImageView qrCodeView = findViewById(R.id.ticketQR);
                        try {
                            Bitmap qrBitMap = encodeAsBitmap(t.ticketId);
                            if(qrBitMap != null) qrCodeView.setImageBitmap(qrBitMap);
                        } catch (WriterException ignored) { }

                    }
                }
            }

            @Override
            public void resultHandler(String msg, int resultCode) {
                if (resultCode == 1) {
                    markAsBooked(book);
                    db.increment("events", event.eventId, "attendeeCount", 1, 2);
                    db.filterWithTwoFields("tickets", "userId", mAuth.getUid(), "eventId", event.eventId, Ticket.class, 0);
                } else if (resultCode == 2){
                    event.attendeeCount += 1;
                    countView.setText(event.attendeeCount + " going");
                } else {
                    Toast.makeText(ViewEventActivity.this, msg, Toast.LENGTH_LONG).show();
                }
            }
        });

        db.filterWithTwoFields("tickets", "userId", mAuth.getUid(), "eventId", event.eventId, Ticket.class, 0);
    }

    private void markAsBooked(MaterialButton book) {
        book.setBackgroundColor(ContextCompat.getColor(this, R.color.red));
        book.setText("Booked");
    }

    private Bitmap encodeAsBitmap(String str) throws WriterException {
        BitMatrix result;
        try {
            result = new MultiFormatWriter().encode(str, BarcodeFormat.QR_CODE, 200, 200, null);
        } catch (IllegalArgumentException e) {
            return null;
        }

        int w = result.getWidth();
        int h = result.getHeight();
        int[] pixels = new int[w * h];
        for (int y = 0; y < h; y++) {
            int offset = y * w;
            for (int x = 0; x < w; x++) {
                pixels[offset + x] = result.get(x, y) ? BLACK : WHITE;
            }
        }

        Bitmap bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
        bitmap.setPixels(pixels, 0, 200, 0, 0, w, h);
        return bitmap;
    }


}