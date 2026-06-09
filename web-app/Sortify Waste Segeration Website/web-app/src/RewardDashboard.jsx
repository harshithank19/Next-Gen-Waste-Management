// RewardDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from "./supabase";
import { Trophy, Flame, Leaf, Star } from 'lucide-react';

/**
 * Reworked RewardDashboard with:
 * - robust user detection: use propUserId if passed, otherwise fetch current supabase user and subscribe to auth changes
 * - persistent reads from user_rewards & task_logs
 * - protected insert to task_logs (avoids double-award on refresh)
 * - upsert of user_rewards to persist totals
 * - leaderboard fetch (from leaderboard_view that exposes display_name/email)
 *
 * NOTE: This code assumes tables:
 * - user_rewards (user_id PK, total_points int, streak int)
 * - task_logs (user_id, task_id, completed boolean, reward int, completion_date date)
 *
 * leaderboard_view must expose: user_id, display_name, email, total_points
 */

export default function RewardDashboard({ loggedInUserId: propUserId }) {
  // if parent supplied user id, use it; otherwise fetch from supabase auth
  const [loggedInUserId, setLoggedInUserId] = useState(propUserId || null);

  // Auth detection: populate loggedInUserId if not passed from parent,
  // and subscribe to auth state changes so component reacts to login/logout.
  useEffect(() => {
    if (propUserId) return; // parent provided it — no local auth fetch needed

    let mounted = true;

    (async () => {
      try {
        // Supabase v2
        const { data } = await supabase.auth.getUser();
        if (mounted && data?.user?.id) {
          setLoggedInUserId(data.user.id);
          console.log("RewardDashboard: detected user from supabase.auth.getUser()", data.user.id);
        } else {
          console.log("RewardDashboard: no user session found on mount");
        }
      } catch (err) {
        console.error("RewardDashboard getUser error:", err);
      }
    })();

    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // session may be null on sign-out
      const uid = session?.user?.id || null;
      if (mounted) {
        setLoggedInUserId(uid);
        console.log("RewardDashboard auth change:", event, uid);
      }
    });

    return () => {
      mounted = false;
      // unsubscribe safely
      try {
        listener?.subscription?.unsubscribe?.();
      } catch (e) {
        // older/newer supabase SDK shapes may differ; ignore unsubscribe errors
      }
    };
  }, [propUserId]);

  // reward state
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Separate dry/wet waste at home?", reward: 5, done: false, key: "separate_dry_wet" },
    { id: 2, text: "Dispose food/wet waste in covered bin?", reward: 5, done: false, key: "dispose_food_covered" },
    { id: 3, text: "Store metal waste separately?", reward: 5, done: false, key: "store_metal" },
    { id: 4, text: "Keep household bin area clean?", reward: 5, done: false, key: "keep_bin_clean" }
  ]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showBonus, setShowBonus] = useState(false);
  const [busy, setBusy] = useState(false);

  const todayDateString = () => {
    // Use UTC date string YYYY-MM-DD to match DB date usage (avoid timezone issues).
    const dt = new Date();
    const yyyy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Load user points & completed tasks & leaderboard when loggedInUserId is available
  useEffect(() => {
    if (!loggedInUserId) {
      // clear UI when no user
      setPoints(0);
      setStreak(0);
      setTodayPoints(0);
      setTasks(prev => prev.map(t => ({ ...t, done: false })));
      setLeaderboard([]);
      return;
    }

    const loadData = async () => {
      try {
        // 1) Ensure a user_rewards row exists (optional)
        const { data: rewards, error: rewardsErr } = await supabase
          .from("user_rewards")
          .select("user_id,total_points,streak")
          .eq("user_id", loggedInUserId)
          .single();

        if (rewardsErr && rewardsErr.code === "PGRST116") {
          // not found - create initial row
          await supabase.from("user_rewards").insert({ user_id: loggedInUserId, total_points: 0, streak: 0 });
          setPoints(0);
          setStreak(0);
        } else if (rewards) {
          setPoints(rewards.total_points || 0);
          setStreak(rewards.streak || 0);
        }

        // 2) Fetch today's completed tasks for this user (so UI shows Done)
        const today = todayDateString();
        const { data: taskData, error: taskErr } = await supabase
          .from("task_logs")
          .select("task_id,reward,completed,completion_date")
          .eq("user_id", loggedInUserId)
          .eq("completed", true)
          .eq("completion_date", today);

        if (!taskErr && Array.isArray(taskData)) {
          const doneTaskIds = new Set(taskData.map(t => t.task_id));
          setTasks(prevTasks => prevTasks.map(t => ({ ...t, done: doneTaskIds.has(t.id) })));

          // compute today's points from task_logs sum (robust)
          const todaySum = taskData.reduce((acc, r) => acc + (r.reward || 0), 0);
          setTodayPoints(todaySum);
        } else {
          // if none, ensure todayPoints = 0
          setTodayPoints(0);
        }

        // 3) Fetch leaderboard from the new view
        const { data: lbData, error: lbErr } = await supabase
          .from("leaderboard_view")
          .select("user_id, display_name, email, total_points")
          .order("total_points", { ascending: false })
          .limit(10);

        if (!lbErr && lbData) {
          setLeaderboard(lbData);
        } else {
          console.warn("Could not load leaderboard_view, lbErr:", lbErr);
          // fallback: select from user_rewards if view missing
          const { data: lbFallback } = await supabase
            .from("user_rewards")
            .select("user_id,total_points")
            .order("total_points", { ascending: false })
            .limit(10);
          if (lbFallback) setLeaderboard(lbFallback);
        }
      } catch (err) {
        console.error("loadData error:", err);
      }
    };

    loadData();
  }, [loggedInUserId]);

  // Helper: refresh leaderboard (from view)
  const refreshLeaderboard = async () => {
    const { data: lbData, error: lbErr } = await supabase
      .from("leaderboard_view")
      .select("user_id, display_name, email, total_points")
      .order("total_points", { ascending: false })
      .limit(10);

    if (!lbErr && lbData) setLeaderboard(lbData);
    else console.warn("refreshLeaderboard failed:", lbErr);
  };

  // Task complete handler (safe)
  const handleTaskComplete = async (id) => {
    if (!loggedInUserId) return alert("Please sign in to claim rewards.");
    if (busy) return;
    const task = tasks.find(t => t.id === id);
    if (!task || task.done) return;

    setBusy(true);
    try {
      const today = todayDateString();

      // 1) Try to insert into task_logs as the canonical proof of completion.
      //    task_logs table should have UNIQUE(user_id, task_id, completion_date) on the DB to avoid duplicates.
      const insertPayload = {
        user_id: loggedInUserId,
        task_id: task.id,
        completed: true,
        reward: task.reward,
        completed_at: new Date().toISOString(),
        completion_date: today
      };

      const { data: insertResult, error: insertErr } = await supabase
        .from("task_logs")
        .insert(insertPayload);

      if (insertErr) {
        // If unique violation or duplicate, treat as already completed (safe)
        const isUniqueError = insertErr.code === "23505" || (insertErr.message && insertErr.message.toLowerCase().includes("duplicate"));
        if (isUniqueError) {
          // already inserted by another tab/refresh — fetch current user_rewards and mark done locally
          const { data: urExisting } = await supabase
            .from("user_rewards")
            .select("total_points")
            .eq("user_id", loggedInUserId)
            .single();

          if (urExisting) setPoints(urExisting.total_points || 0);

          // mark task done locally
          setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));
          // recalc todayPoints from task_logs
          const { data: todays } = await supabase
            .from("task_logs")
            .select("reward")
            .eq("user_id", loggedInUserId)
            .eq("completion_date", today)
            .eq("completed", true);
          if (todays) setTodayPoints(todays.reduce((s, r) => s + (r.reward || 0), 0));
          await refreshLeaderboard();
          return;
        } else {
          console.error("Insert task_logs error:", insertErr);
          alert("Error saving task completion: " + insertErr.message);
          return;
        }
      }

      // If we reach here, insert succeeded (new completion).
      // 2) Fetch current user_rewards so we can compute new totals
      const { data: ur, error: urErr } = await supabase
        .from("user_rewards")
        .select("total_points,streak")
        .eq("user_id", loggedInUserId)
        .single();

      let currentTotal = 0;
      let currentStreak = 0;
      if (!urErr && ur) {
        currentTotal = ur.total_points || 0;
        currentStreak = ur.streak || 0;
      }

      const newTotal = currentTotal + task.reward;

      // 3) Upsert new totals into user_rewards
      const upsertPayload = {
        user_id: loggedInUserId,
        total_points: newTotal,
        streak: currentStreak
      };

      const { error: upsertErr } = await supabase
        .from("user_rewards")
        .upsert(upsertPayload, { onConflict: ["user_id"] });

      if (upsertErr) {
        console.error("Upsert user_rewards error:", upsertErr);
      }

      // 4) Update local state to reflect persisted change
      setPoints(newTotal);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));

      // recalc today's points by querying task_logs for the day
      const { data: todaysAfter } = await supabase
        .from("task_logs")
        .select("reward")
        .eq("user_id", loggedInUserId)
        .eq("completion_date", today)
        .eq("completed", true);

      if (todaysAfter) setTodayPoints(todaysAfter.reduce((s, r) => s + (r.reward || 0), 0));

      // refresh leaderboard
      await refreshLeaderboard();
    } catch (err) {
      console.error("handleTaskComplete error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setBusy(false);
    }
  };

  // Weekly bonus (safe: try insert a special task log to prevent duplicate bonus)
  const handleWeeklyBonus = async () => {
    if (!loggedInUserId) return alert("Please sign in to claim bonus.");
    if (showBonus || busy) return;

    setBusy(true);
    try {
      const bonusPoints = 20;
      const today = todayDateString();

      // sentinel task_id for bonus
      const bonusPayload = {
        user_id: loggedInUserId,
        task_id: 999999,
        completed: true,
        reward: bonusPoints,
        completed_at: new Date().toISOString(),
        completion_date: today
      };

      const { error: bonusInsertErr } = await supabase.from("task_logs").insert(bonusPayload);

      if (bonusInsertErr) {
        const isUnique = bonusInsertErr.code === "23505" || (bonusInsertErr.message && bonusInsertErr.message.toLowerCase().includes("duplicate"));
        if (isUnique) {
          setShowBonus(true);
          return;
        } else {
          console.error("bonus insert error:", bonusInsertErr);
          alert("Could not claim bonus: " + bonusInsertErr.message);
          return;
        }
      }

      // fetch current total
      const { data: ur, error: urErr } = await supabase
        .from("user_rewards")
        .select("total_points")
        .eq("user_id", loggedInUserId)
        .single();

      let currentTotal = 0;
      if (!urErr && ur) currentTotal = ur.total_points || 0;
      const newTotal = currentTotal + bonusPoints;

      // upsert new total
      await supabase.from("user_rewards").upsert({ user_id: loggedInUserId, total_points: newTotal }, { onConflict: ["user_id"] });

      setPoints(newTotal);
      setShowBonus(true);
      await refreshLeaderboard();
    } catch (err) {
      console.error("handleWeeklyBonus error:", err);
      alert("Error claiming bonus.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 space-y-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-around items-center bg-slate-800 p-6 rounded-2xl shadow-md"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-400">{points}</h2>
          <p className="text-slate-300">Total Points</p>
        </div>
        <div className="text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto" />
          <p className="text-2xl font-bold text-yellow-300">+{todayPoints}</p>
          <p className="text-slate-300">Today’s Points</p>
        </div>
      </motion.div>

      {/* DAILY ECO TASKS */}
      <section className="bg-slate-800 p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-semibold text-green-400 mb-4">🌱 Daily Eco-Tasks</h2>
        {tasks.map(task => (
          <motion.div
            key={task.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg flex justify-between items-center transition-all ${
              task.done ? 'bg-green-700/50' : 'bg-slate-700/50'
            }`}
          >
            <span>{task.text}</span>
            <Button
              disabled={task.done || busy}
              className={`ml-4 ${task.done ? 'bg-green-600' : 'gradient-bg'}`}
              onClick={() => handleTaskComplete(task.id)}
            >
              {task.done ? '✔ Done' : `+${task.reward} Points`}
            </Button>
          </motion.div>
        ))}

        {!showBonus ? (
          <div className="text-center mt-6">
            <Button className="gradient-bg" onClick={handleWeeklyBonus} disabled={busy}>
              Claim Weekly Streak Bonus (+20 pts)
            </Button>
          </div>
        ) : (
          <p className="text-green-400 text-center mt-6 font-semibold">
            🎉 Weekly Bonus Added! Keep up the good work!
          </p>
        )}
      </section>
    </div>
  );
}



