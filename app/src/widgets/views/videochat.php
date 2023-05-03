<div class="wrapper">
    <header class="header">
        <div><label>Your name: </label><input type="text" name="name" id="alias" size="20" class="name" disabled></div>
    </header>
    <div class="container">
        <div class="chat-side">
            <div id="chat-area"></div>

            <div class="text-input">
                <textarea id="message-area" type="text" class="input" aria-multiline="true"></textarea>
                <div class="send-btn controls">
                    <button class="btn" id="send"><i class="fa-solid fa-share"></i></button>
                </div>
            </div>

            <br>

        </div>
        <div class="videos-side">
            <div class="video-container">
            </div>
            <div class="controls">
                <button id="screenshare"><i class="fa-sharp fa-solid fa-desktop"></i></button>
                <button id="videotoggle"><i class="fa-solid fa-video-slash"></i></button>
                <button id="audiotoggle"><i class="fa-solid fa-microphone-lines-slash"></i></button>
                <button id="sendfile"><i class="fa-sharp fa-solid fa-file-export"></i></button>
                <button id="exit"><i class="fa-solid fa-person-walking-arrow-right"></i></button>
            </div>
            <input type="file" multiple name="files" id="file-input" style="display: none;">
        </div>

    </div>
    <footer class="footer">
        &copy; Kuzovkov A.V. 2023
    </footer>
</div>