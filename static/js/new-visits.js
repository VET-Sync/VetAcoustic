document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('record-button');
    const stopBtn = document.getElementById('stop-button');
    const audioPreview = document.getElementById('audio-preview');
    const statusLabel = document.getElementById('record-status-label');
    const analyzeBtn = document.getElementById('analyze-button');
    
    let mediaRecorder;
    let audioChunks = [];

    // عند الضغط على زر التسجيل
    recordBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPreview.src = audioUrl;
                audioPreview.classList.remove('hidden');
                statusLabel.innerText = "Recording saved locally.";
                
                // حفظ الصوت مؤقتاً للانتقال لصفحة النتائج
                analyzeBtn.disabled = false;
            };

            mediaRecorder.start();
            recordBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
            statusLabel.innerText = "Recording in progress... (Listening)";
            statusLabel.style.color = "red";
        } catch (err) {
            alert("Please allow microphone access!");
        }
    });

    // عند الضغط على زر الإيقاف
    stopBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            stopBtn.classList.add('hidden');
            recordBtn.classList.remove('hidden');
            recordBtn.innerHTML = "Re-record";
            statusLabel.style.color = "black";
        }
    });

    // عند الضغط على Analyze (ينقلك لصفحة النتائج الوهمية حالياً)
    document.getElementById('visit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'results.html';
    });
});
