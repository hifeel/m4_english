// Main index renderer - builds topic cards from JSON data

var ET_TOPIC_META = {
    airport:    { icon: '✈️', subtitle: '입국, 수하물, 세관' },
    hotel:      { icon: '🏨', subtitle: '체크인, 질문, 체크아웃' },
    restaurant: { icon: '🍽️', subtitle: '좌석, 주문, 계산' },
    taxi_driver:{ icon: '🚕', subtitle: '택시, 길 찾 �기' },
    emergency:  { icon: '🚨', subtitle: '분실, 경찰, 응급' }
};

function etBuildIndex() {
    etLoadData().then(function() {
        var cats = etGetCategories();
        var html = '';
        for (var i = 0; i < cats.length; i++) {
            var c = cats[i];
            var meta = ET_TOPIC_META[c.key] || { icon: '💬', subtitle: '' };
            var totalDialogues = 0;
            for (var j = 0; j < c.scenarios.length; j++) {
                totalDialogues += c.scenarios[j].dialogues.length;
            }
            var prog = etCategoryProgress(c.key);
            var shortTitle = c.title.replace(/^[^\s]+\s/, '');
            html +=
                '<a href="category.html?cat=' + c.key + '" class="topic-card">' +
                '<div class="topic-icon">' + meta.icon + '</div>' +
                '<div class="topic-title">' + etEsc(shortTitle) + '</div>' +
                '<div class="topic-subtitle">' + etEsc(meta.subtitle) + '</div>' +
                '<div class="topic-count">' + totalDialogues + '문장</div>' +
                '<div class="topic-progress">' +
                '<div class="topic-progress-text">' + prog.done + ' / ' + prog.total + ' 완료</div>' +
                '<div class="topic-progress-track"><div class="topic-progress-fill" style="width:' + prog.percent + '%"></div></div>' +
                '</div>' +
                '</a>';
        }

        // Overall progress banner at top
        var overall = etTotalProgress();
        var banner = document.getElementById('overallProgress');
        banner.innerHTML =
            '<div class="overall-text">📚 M4 전체 공부 진행률: ' + overall.done + ' / ' + overall.total + ' 시나리오 (' + overall.percent + '%)</div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:' + overall.percent + '%"></div></div>';

        document.getElementById('topicsGrid').innerHTML = html;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', etBuildIndex);
} else {
    etBuildIndex();
}

// Re-render when returning from bfcache (back button) so progress updates instantly
window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
        etBuildIndex();
    }
});