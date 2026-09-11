import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ==================================================
// CONTEXT
// ==================================================

const PermissionsContext = createContext(null);

// ==================================================
// PROVIDER
// Fetches the logged-in user's rights ONCE and holds
// them in memory. Mount this above whatever part of
// the app needs permission checks (Masters forms).
// ==================================================

export function PermissionsProvider({ children }) {
  const [role, setRole] = useState(null);

  const [rights, setRights] = useState({});

  const [loading, setLoading] = useState(true);

  const fetchRights = useCallback(async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setRole(null);

      setRights({});

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/user-rights/me`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load permissions."
        );
      }

      const data = await response.json();

      setRole(data.role || null);

      setRights(data.rights || {});
    } catch (err) {
      console.error(
        "Fetch permissions error:",
        err
      );

      // ==============================================
      // DENY BY DEFAULT ON ANY FAILURE
      // If we can't confirm what someone is allowed to
      // do, we assume they're allowed to do nothing.
      // ==============================================

      setRole(null);

      setRights({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRights();
  }, [fetchRights]);

  // ==================================================
  // CAN
  // Admins bypass every check. Everyone else is looked
  // up in the rights map; anything missing is False.
  // ==================================================

  const can = useCallback(
    (module, action) => {
      if (role === "admin") {
        return true;
      }

      return Boolean(rights?.[module]?.[action]);
    },
    [role, rights]
  );

  const value = {
    role,

    rights,

    loading,

    can,

    refreshRights: fetchRights,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

// ==================================================
// HOOK
// ==================================================

export function usePermissions() {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error(
      "usePermissions must be used inside a PermissionsProvider."
    );
  }

  return context;
}

// ==================================================
// <CAN> WRAPPER COMPONENT
// The piece every Masters form uses directly:
//
//   <Can module="hobby" action="add">
//     <button>Add Hobby</button>
//   </Can>
//
// Renders nothing (or `fallback`) if the current user
// lacks that right. While permissions are still
// loading, nothing renders either — deny by default,
// no flash of buttons someone doesn't actually have.
// ==================================================

export function Can({ module, action, children, fallback = null }) {
  const { can, loading } = usePermissions();

  if (loading) {
    return fallback;
  }

  return can(module, action) ? children : fallback;
}
