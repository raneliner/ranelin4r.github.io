(function() {
    const startDate = new Date(2023, 0, 5, 13, 0, 0, 0); // 注意：月份从0开始，0 = 1月

    function updateElapsedTime() {
        const now = new Date();
        const difference = now - startDate; // 已过去的毫秒数

        // 统一计算以防精度问题（先算总秒，再拆分）
        const totalSeconds = Math.floor(difference / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const hours = totalHours % 24;
        const days = Math.floor(totalHours / 24); // 自 2023-01-01 起的累计天数

        // 更新页面显示
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // 初始化显示并每秒更新
    updateElapsedTime();
    setInterval(updateElapsedTime, 1000);
})();
