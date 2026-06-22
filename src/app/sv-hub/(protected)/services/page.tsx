export const dynamic = 'force-dynamic';

const SERVICES = [
  {
    name: 'Video',
    items: [
      { label: 'Short Form Video', range: '$300 – $700/video' },
      { label: 'Event Coverage', range: '$800 – $2,500/event' },
    ],
  },
  {
    name: 'Graphic Design',
    items: [
      { label: 'Social Pack', range: '$300 – $600/project' },
      { label: 'Wedding Suite', range: '$250 – $800/project' },
      { label: 'Business Branding', range: '$500 – $2,000/project' },
    ],
  },
  {
    name: 'Photography',
    items: [
      { label: 'Event', range: '$500 – $1,500/event' },
      { label: 'Brand / Product', range: '$400 – $1,200/session' },
    ],
  },
  {
    name: 'Social Media Management',
    items: [
      { label: 'Monthly Retainer', range: '$500 – $1,200/mo' },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: '#3D2B1F' }}>Services</h1>
        <p className="text-sm text-gray-500 mt-1">Service categories and pricing reference</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SERVICES.map((category) => (
          <div key={category.name} className="card p-6">
            <h2 className="font-bold text-base mb-4" style={{ color: '#3D2B1F' }}>{category.name}</h2>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item.label} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold tabular-nums" style={{ color: '#E8521A' }}>{item.range}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-sm mb-2" style={{ color: '#3D2B1F' }}>Service Type Tags</h2>
        <p className="text-xs text-gray-500 mb-4">Used when categorizing clients</p>
        <div className="flex flex-wrap gap-2">
          {['Video', 'Graphic Design', 'Photography', 'Wedding', 'Other'].map((s) => (
            <span key={s} className="badge-teal">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
