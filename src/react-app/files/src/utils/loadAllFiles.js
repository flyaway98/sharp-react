/**
 * Load all resources in the request context
 * @param {*} requireContext
 * expamle:
 *  const context=require.context('./img', false, /\.img$/)
 *  requireAll(context)
 */
const requireAll = requireContext => requireContext.keys().map(requireContext);
export default requireAll;