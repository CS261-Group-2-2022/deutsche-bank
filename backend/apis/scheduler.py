import schedule
import threading
import time


def background_scheduler(interval=1):
    """Continuously run, while executing pending jobs at each elapsed
    time interval.
    :return: cease_continuous_run: threading.Event which can be set to
    end the background scheduler.
    """

    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):

        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                schedule.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run
