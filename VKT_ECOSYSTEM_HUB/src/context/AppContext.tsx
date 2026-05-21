import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultApps, defaultSiteConfig, defaultPlans } from '../data/apps';
import type { AppConfig, SiteConfig, Plan } from '../data/apps';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppContextType {
  apps: AppConfig[];
  siteConfig: SiteConfig;
  plans: Plan[];
  updateApp: (updatedApp: AppConfig) => Promise<void>;
  addApp: () => Promise<string>;
  deleteApp: (id: string) => Promise<void>;
  updateSiteConfig: (newConfig: SiteConfig) => Promise<void>;
  resetToDefault: () => Promise<void>;
  // Plans CRUD
  addPlan: (plan: Omit<Plan, 'id' | 'sortOrder'>) => Promise<string>;
  updatePlan: (plan: Plan) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  loading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Apps collection
    const appsCollection = collection(db, 'apps');
    const unsubApps = onSnapshot(appsCollection, async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          defaultApps.forEach(app => batch.set(doc(db, 'apps', app.id), app));
          await batch.commit();
        } catch (e) { console.error('Firebase write apps error:', e); }
      } else {
        const loaded = snapshot.docs.map(d => d.data() as AppConfig);
        const sorted = [...loaded].sort((a, b) => {
          const ia = defaultApps.findIndex(da => da.id === a.id);
          const ib = defaultApps.findIndex(da => da.id === b.id);
          return (ia !== -1 ? ia : 99) - (ib !== -1 ? ib : 99);
        });
        setApps(sorted);
      }
    }, (err) => { console.error('Apps listener error:', err); setApps(defaultApps); });

    // 2. Settings document
    const settingsDoc = doc(db, 'settings', 'main');
    const unsubSettings = onSnapshot(settingsDoc, async (snapshot) => {
      if (!snapshot.exists()) {
        try { await setDoc(settingsDoc, defaultSiteConfig); } catch (e) { console.error(e); }
      } else {
        setSiteConfig(snapshot.data() as SiteConfig);
      }
      setLoading(false);
    }, (err) => { console.error('Settings listener error:', err); setSiteConfig(defaultSiteConfig); setLoading(false); });

    // 3. Plans collection
    const plansCollection = collection(db, 'plans');
    const unsubPlans = onSnapshot(plansCollection, async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          defaultPlans.forEach(p => batch.set(doc(db, 'plans', p.id), p));
          await batch.commit();
        } catch (e) { console.error('Firebase write plans error:', e); }
      } else {
        const loaded = snapshot.docs.map(d => d.data() as Plan);
        const sorted = [...loaded].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
        setPlans(sorted);
      }
    }, (err) => { console.error('Plans listener error:', err); setPlans(defaultPlans); });

    return () => { unsubApps(); unsubSettings(); unsubPlans(); };
  }, []);

  // ─── Apps CRUD ────────────────────────────────────────────────────────────

  const updateApp = async (updatedApp: AppConfig) => {
    await setDoc(doc(db, 'apps', updatedApp.id), updatedApp, { merge: true });
  };

  const addApp = async (): Promise<string> => {
    const newId = `app-${Date.now()}`;
    const newApp: AppConfig = {
      id: newId, name: 'Ứng dụng mới', description: 'Mô tả ứng dụng mới',
      url: '', iconName: 'Sparkles', color: 'from-slate-500 to-slate-700', isHidden: false,
    };
    await setDoc(doc(db, 'apps', newId), newApp);
    return newId;
  };

  const deleteApp = async (id: string) => {
    await deleteDoc(doc(db, 'apps', id));
  };

  // ─── Site Config ──────────────────────────────────────────────────────────

  const updateSiteConfig = async (newConfig: SiteConfig) => {
    await setDoc(doc(db, 'settings', 'main'), newConfig, { merge: true });
  };

  const resetToDefault = async () => {
    const batch = writeBatch(db);
    defaultApps.forEach(app => batch.set(doc(db, 'apps', app.id), app));
    batch.set(doc(db, 'settings', 'main'), defaultSiteConfig);
    await batch.commit();
  };

  // ─── Plans CRUD ───────────────────────────────────────────────────────────

  const addPlan = async (plan: Omit<Plan, 'id' | 'sortOrder'>): Promise<string> => {
    const newId = `plan-${Date.now()}`;
    const newPlan: Plan = { ...plan, id: newId, sortOrder: plans.length };
    await setDoc(doc(db, 'plans', newId), newPlan);
    return newId;
  };

  const updatePlan = async (plan: Plan) => {
    await setDoc(doc(db, 'plans', plan.id), plan, { merge: true });
  };

  const deletePlan = async (id: string) => {
    await deleteDoc(doc(db, 'plans', id));
  };

  return (
    <AppContext.Provider value={{
      apps, siteConfig, plans, loading,
      updateApp, addApp, deleteApp, updateSiteConfig, resetToDefault,
      addPlan, updatePlan, deletePlan,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
