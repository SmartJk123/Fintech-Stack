import React, { useState, useEffect } from 'react';
import { LifeBuoy, MessageSquare, FileText, Plus, Loader2, Send, ChevronDown, ChevronUp } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import StatusBadge from '@/components/StatusBadge';
import DemoBadge from '@/components/DemoBadge';
import { supportService } from '@/lib/mock/services';
import { formatDate } from '@/lib/utils';

export default function Support() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: '', category: 'Transactions', priority: 'Medium', description: '' });

  useEffect(() => {
    Promise.all([supportService.getTickets(), supportService.getFAQs()]).then(([t, f]) => {
      setTickets(t); setFaqs(f); setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await supportService.createTicket(form);
    setSubmitting(false);
    setShowForm(false);
    setTickets(t => [{ id: `tkt-${Date.now()}`, ...form, status: 'Open', date: new Date().toISOString().slice(0, 10), lastUpdate: new Date().toISOString().slice(0, 10) }, ...t]);
    setForm({ subject: '', category: 'Transactions', priority: 'Medium', description: '' });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support</h1>
          <p className="text-sm text-muted-foreground">Get help with your EliteWallet account</p>
        </div>
        <DemoBadge />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Live Chat</h3>
          <p className="text-sm text-muted-foreground">Chat with our support team</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <FileText className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Help Center</h3>
          <p className="text-sm text-muted-foreground">Browse guides and articles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-elite">
          <Plus className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">New Ticket</h3>
          <p className="text-sm text-muted-foreground">Submit a support request</p>
        </button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Create Support Ticket</h3>
          <div className="mt-4 space-y-4">
            <div><label className="text-sm font-medium">Subject</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm"><option>Transactions</option><option>Security</option><option>Account</option><option>Payments</option><option>Other</option></select></div>
              <div><label className="text-sm font-medium">Priority</label><select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
            </div>
            <div><label className="text-sm font-medium">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4} className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" /></div>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit Ticket
            </button>
          </div>
        </form>
      )}

      {/* My tickets */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">My Tickets</h3>
        {loading ? <LoadingSkeleton className="mt-4" lines={3} /> : tickets.length === 0 ? (
          <EmptyState icon={LifeBuoy} title="No support tickets" description="You haven't submitted any tickets yet." />
        ) : (
          <div className="mt-4 space-y-2">
            {tickets.map(t => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">{t.category} · {formatDate(t.date, { dateOnly: true })}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Frequently Asked Questions</h3>
        <div className="mt-4 space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left">
                <span className="text-sm font-medium">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {openFaq === i && <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}