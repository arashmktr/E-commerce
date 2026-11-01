import EmptyState from '../components/ui/EmptyState.jsx';

const NotFoundPage = () => (
  <EmptyState
    title="صفحه‌ای که دنبالش بودید پیدا نشد"
    text="آدرس را بررسی کنید یا به صفحه اصلی برگردید."
    actionLabel="صفحه اصلی"
    actionTo="/"
  />
);

export default NotFoundPage;
