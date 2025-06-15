const trackList = document.getElementById("track-list");
const pendingList = document.getElementById("pending-list");
const uploadForm = document.getElementById("upload-form");

function renderTrack(doc, id) {
  const div = document.createElement("div");
  div.className = "track-card";
  div.innerHTML = `
    <h3>${doc.title} - ${doc.artist}</h3>
    <audio controls src="${doc.url}"></audio>
    <p>Genre: ${doc.genre} ${doc.preRelease ? "?? Pre-Release" : ""}</p>
    <div class="reactions">
      ?? <span id="like-${id}">${doc.reactions?.likes || 0}</span>
      ?? <span id="fire-${id}">${doc.reactions?.fire || 0}</span>
      ?? <span id="loop-${id}">${doc.reactions?.loops || 0}</span>
    </div>
  `;
  div.addEventListener("click", () => {
    const newReactions = {
      likes: (doc.reactions?.likes || 0) + 1,
      fire: (doc.reactions?.fire || 0) + 1,
      loops: (doc.reactions?.loops || 0) + 1
    };
    db.collection("tracks").doc(id).update({ reactions: newReactions });
  });
  trackList.appendChild(div);
}

if (trackList) {
  db.collection("tracks").where("approved", "==", true).onSnapshot(snapshot => {
    trackList.innerHTML = "";
    snapshot.forEach(doc => renderTrack(doc.data(), doc.id));
  });
}

if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const artist = document.getElementById("artist").value;
    const genre = document.getElementById("genre").value;
    const preRelease = document.getElementById("preRelease").checked;
    const file = document.getElementById("audioFile").files[0];

    const storageRef = storage.ref(`music/${artist}/${file.name}`);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();

    await db.collection("tracks").add({
      title, artist, genre, url, preRelease,
      approved: false,
      reactions: { likes: 0, fire: 0, loops: 0 },
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Uploaded! Awaiting admin approval.");
    uploadForm.reset();
  });

  db.collection("tracks").where("approved", "==", false).onSnapshot(snapshot => {
    pendingList.innerHTML = "";
    snapshot.forEach(doc => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${doc.data().title}</strong> by ${doc.data().artist}
        <button onclick="approveTrack('${doc.id}')">? Approve</button>
      `;
      pendingList.appendChild(div);
    });
  });
}

function approveTrack(id) {
  db.collection("tracks").doc(id).update({ approved: true });
}
